import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import os

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Зареждане на данни
df = pd.read_csv(os.path.join(script_dir, 'training_data.csv'))

# Премахване на излишни интервали
for col in df.select_dtypes(include='object').columns:
    df[col] = df[col].str.strip()

# Разделяне на признаци и целева променлива
X = df.drop(columns=['размер'])
y = df['размер']

# Определяне на колони
numerical_cols = ['височина', 'тегло', 'талия', 'гръдна_обиколка', 'ширина_дреха']
categorical_cols = ['пол', 'телосложение', 'материя', 'тип_дреха']

# Създаване на pipeline
preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numerical_cols),
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
])

pipeline = Pipeline([
    ('preprocessing', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

# Обучение
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
pipeline.fit(X_train, y_train)

# Calculate and print accuracy
accuracy = pipeline.score(X_test, y_test)
print(f"Model accuracy on test set: {accuracy:.2%}")

# Запазване на модела
model_path = os.path.join(script_dir, 'model.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(pipeline, f)

print(f"✅ Моделът е обучен и записан като '{model_path}'") 