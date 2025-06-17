import pandas as pd
import numpy as np
import joblib
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import os

def evaluate_model():
    try:
        # Зареждане на данните
        dataset_path = os.path.join(os.path.dirname(__file__), 'training_data.csv')
        df = pd.read_csv(dataset_path)
        print("📊 Dataset loaded successfully!")
        print(f"Dataset shape: {df.shape}")
        print(f"Size distribution:\n{df['size'].value_counts()}\n")

        # Зареждане на модела и препроцесорите
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        model_data = joblib.load(model_path)
        model = model_data['model']
        scaler = model_data['scaler']
        label_encoders = model_data['label_encoders']
        numerical_features = model_data['numerical_features']
        categorical_features = model_data['categorical_features']

        # Подготовка на данните
        X_numerical = df[numerical_features]
        X_numerical_scaled = scaler.transform(X_numerical)

        X_categorical = pd.DataFrame()
        for feature in categorical_features:
            X_categorical[feature] = label_encoders[feature].transform(df[feature])

        X = np.column_stack([X_numerical_scaled, X_categorical])
        y = df['size']

        # Прогноза
        y_pred = model.predict(X)

        # Изчисляване на метрики
        accuracy = accuracy_score(y, y_pred)
        report = classification_report(y, y_pred)
        conf_matrix = confusion_matrix(y, y_pred, labels=model.classes_)

        # Запис на резултатите във файл
        results_path = os.path.join(os.path.dirname(__file__), 'model_metrics.txt')
        with open(results_path, 'w') as f:
            f.write("🎯 Model Evaluation Metrics\n")
            f.write("=" * 50 + "\n\n")
            
            f.write(f"📊 Overall Accuracy: {accuracy:.2%}\n\n")
            
            f.write("📋 Classification Report:\n")
            f.write(report + "\n")
            
            f.write("📈 Confusion Matrix:\n")
            f.write(str(conf_matrix) + "\n\n")
            
            f.write("🏷️ Class Labels:\n")
            f.write(str(list(model.classes_)) + "\n\n")
            
            # Изчисляване на feature importance от вероятностите
            feature_importance = pd.DataFrame({
                'feature': numerical_features + categorical_features,
                'importance': np.zeros(len(numerical_features + categorical_features))
            })
            
            # Изчисляване на importance чрез permutation importance
            from sklearn.inspection import permutation_importance
            r = permutation_importance(model, X, y, n_repeats=10, random_state=42)
            feature_importance['importance'] = r.importances_mean
            
            # Сортиране по importance
            feature_importance = feature_importance.sort_values('importance', ascending=False)
            f.write("📊 Feature Importance:\n")
            f.write(feature_importance.to_string(index=False))

        # Създаване на визуализация на confusion matrix
        plt.figure(figsize=(10, 8))
        sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues',
                   xticklabels=model.classes_,
                   yticklabels=model.classes_)
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        
        # Запазване на графиката
        plot_path = os.path.join(os.path.dirname(__file__), 'confusion_matrix.png')
        plt.savefig(plot_path)
        plt.close()

        print(f"✅ Evaluation complete! Results saved to {results_path}")
        print(f"📊 Confusion matrix plot saved to {plot_path}")

    except Exception as e:
        print(f"❌ Error during evaluation: {str(e)}")

if __name__ == '__main__':
    evaluate_model() 