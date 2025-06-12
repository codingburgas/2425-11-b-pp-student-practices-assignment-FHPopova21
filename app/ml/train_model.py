import os
import logging
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def train_model():
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
        
        # Define parameter grid for GridSearchCV
        param_grid = {
            'n_estimators': [200, 300, 400],
            'max_depth': [10, 20, 30, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4],
            'class_weight': ['balanced', 'balanced_subsample']
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
        model = grid_search.best_estimator_
        
        # Log best parameters
        logger.info(f"Best parameters: {grid_search.best_params_}")
        
        # Perform cross-validation on the best model
        cv_scores = cross_val_score(model, X_train, y_train, cv=5)
        logger.info(f"Cross-validation scores: {cv_scores}")
        logger.info(f"Average CV score: {cv_scores.mean():.2f} (+/- {cv_scores.std() * 2:.2f})")
        
        # Evaluate the model
        train_accuracy = model.score(X_train, y_train)
        test_accuracy = model.score(X_test, y_test)
        logger.info(f"Training accuracy: {train_accuracy:.2f}")
        logger.info(f"Testing accuracy: {test_accuracy:.2f}")
        
        # Log feature importance
        feature_importance = pd.DataFrame({
            'feature': numerical_features + categorical_features,
            'importance': model.feature_importances_
        }).sort_values('importance', ascending=False)
        logger.info(f"Feature importance:\n{feature_importance}")
        
        # Save the model and preprocessing objects
        model_data = {
            'model': model,
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