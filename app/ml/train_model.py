import os
import logging
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.calibration import CalibratedClassifierCV
import joblib
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_model():
    """
    Обучава ML модел за препоръка на размер на дреха, използвайки тренировъчни данни.
    Записва модела и скалерите във файл.
    """
    try:
        # Load the dataset
        dataset_path = os.path.join(os.path.dirname(__file__), 'training_data.csv')
        df = pd.read_csv(dataset_path)
        logger.info(f"Loaded dataset from {dataset_path}")
        
        # Log dataset info
        logger.info(f"Dataset shape: {df.shape}")
        logger.info(f"Features: {df.columns.tolist()}")
        logger.info(f"Size distribution:\n{df['size'].value_counts()}")
        
        # Prepare features
        numerical_features = ['height', 'weight', 'waist', 'chest']
        categorical_features = ['gender', 'body_type', 'material', 'garment_type']
        
        # Encode categorical features
        label_encoders = {}
        for feature in categorical_features:
            label_encoders[feature] = LabelEncoder()
            df[feature] = label_encoders[feature].fit_transform(df[feature])
            logger.info(f"{feature} categories: {label_encoders[feature].classes_}")
        
        # Scale numerical features
        scaler = StandardScaler()
        df[numerical_features] = scaler.fit_transform(df[numerical_features])
        
        # Prepare X and y
        X = df[numerical_features + categorical_features]
        y = df['size']
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Define parameter grid for GridSearchCV with focus on probability calibration
        param_grid = {
            'n_estimators': [300, 400, 500],
            'max_depth': [15, 20, 25],
            'min_samples_split': [2, 4],
            'min_samples_leaf': [1, 2],
            'class_weight': ['balanced_subsample'],
            'max_features': ['sqrt', 'log2'],
            'bootstrap': [True],
            'criterion': ['gini', 'entropy']
        }
        
        # Initialize base model
        base_model = RandomForestClassifier(random_state=42)
        
        # Perform GridSearchCV
        grid_search = GridSearchCV(
            estimator=base_model,
            param_grid=param_grid,
            cv=5,
            n_jobs=-1,
            scoring='accuracy',
            verbose=2
        )
        
        # Fit the grid search
        grid_search.fit(X_train, y_train)
        
        # Get best model
        best_model = grid_search.best_estimator_
        
        # Calibrate the model's probabilities
        calibrated_model = CalibratedClassifierCV(
            best_model,
            cv=5,
            method='isotonic'
        )
        calibrated_model.fit(X_train, y_train)
        
        # Log best parameters
        logger.info(f"Best parameters: {grid_search.best_params_}")
        
        # Evaluate the model
        train_accuracy = calibrated_model.score(X_train, y_train)
        test_accuracy = calibrated_model.score(X_test, y_test)
        logger.info(f"Training accuracy: {train_accuracy:.2f}")
        logger.info(f"Testing accuracy: {test_accuracy:.2f}")
        
        # Evaluate probability calibration
        from sklearn.metrics import brier_score_loss
        y_pred_proba = calibrated_model.predict_proba(X_test)
        brier_scores = []
        for i in range(len(calibrated_model.classes_)):
            brier_scores.append(brier_score_loss(y_test == calibrated_model.classes_[i], 
                                               y_pred_proba[:, i]))
        logger.info(f"Brier scores for each class: {brier_scores}")
        logger.info(f"Average Brier score: {np.mean(brier_scores):.4f}")
        
        # Log feature importance
        feature_importance = pd.DataFrame({
            'feature': numerical_features + categorical_features,
            'importance': best_model.feature_importances_
        }).sort_values('importance', ascending=False)
        logger.info(f"Feature importance:\n{feature_importance}")

        # Confusion matrix
        from sklearn.metrics import confusion_matrix
        y_test_pred = calibrated_model.predict(X_test)
        cm = confusion_matrix(y_test, y_test_pred, labels=calibrated_model.classes_)

        # Save evaluation results to a file
        eval_path = os.path.join(os.path.dirname(__file__), 'model_evaluation.txt')
        with open(eval_path, 'w') as f:
            f.write(f"Training accuracy: {train_accuracy:.4f}\n")
            f.write(f"Testing accuracy: {test_accuracy:.4f}\n")
            f.write(f"Brier scores for each class: {brier_scores}\n")
            f.write(f"Average Brier score: {np.mean(brier_scores):.4f}\n\n")
            f.write("Confusion matrix (rows: true, cols: pred):\n")
            f.write(str(cm) + '\n')
            f.write(f"Class labels: {list(calibrated_model.classes_)}\n\n")
            f.write("Feature importance:\n")
            f.write(feature_importance.to_string(index=False))
        
        # Save the model and preprocessing objects
        model_data = {
            'model': calibrated_model,
            'scaler': scaler,
            'label_encoders': label_encoders,
            'numerical_features': numerical_features,
            'categorical_features': categorical_features,
            'feature_importance': feature_importance
        }
        
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        joblib.dump(model_data, model_path)
        logger.info(f"Model and preprocessing objects saved to {model_path}")
        
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise

if __name__ == '__main__':
    train_model() 