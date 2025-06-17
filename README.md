<h1 align="center">🧥 SmartFit</h1>
<p align="center">
  <img src="Logo/smartfit-logo.png" alt="SmartFit Logo" width="200"/>
</p>
<p align="center">
  <em>Иновативен проект за интелигентно препоръчване на размери при онлайн пазаруване</em>
</p>
<br>
<p align="center">
  <img alt="Repo size" src="https://img.shields.io/github/repo-size/YourUsername/SmartFit?style=flat-square">
  <img alt="Languages used" src="https://img.shields.io/github/languages/count/YourUsername/SmartFit?style=flat-square">
  <img alt="Last commit" src="https://img.shields.io/github/last-commit/YourUsername/SmartFit?style=flat-square">
</p>

## 🔍 За какво става въпрос?

SmartFit е интелигентна система, която използва машинно обучение, за да предложи най-подходящия размер дреха на база:

- телосложение и мерки на потребителя
- конкретните характеристики на дрехата (ширина, материя, размер)

🎯 Край на върнатите дрехи. Здравей, точен размер!

## 🧠 Как работи?

1. Потребителят въвежда своите мерки
2. Избира дреха от каталога
3. Системата обработва данните с ML модел
4. Връща препоръка:

✅ Препоръчителен размер: M  
⚠️ Ако предпочиташ по-свободни дрехи – L

## 🛠️ Технологии

| Категория    | Технологии                     |
| ------------ | ------------------------------ |
| Backend      | Python + Flask                 |
| ML модел     | Random Forest / Feedforward NN |
| База данни   | SQLite                         |
| Frontend     | HTML / CSS / WTForms / React   |
| Аутентикация | Flask-Login                    |

## 🎨 Визия и роля-базирана функционалност

🔑 **Роли в системата:**

- 👤 Потребител – въвежда мерки, получава препоръка
- 🛠️ Администратор – управлява данни за дрехи и потребители
- 🧵 Търговец _(опция)_ – добавя нови модели дрехи

## 📸 Преглед на функционалност

<p align="center">
  <img src="Screenshots/size-recommendation.png" alt="Size Recommendation Example" width="500"/>
</p>

## 💻 Стартиране на проекта

```bash
# Клонирай проекта
git clone https://github.com/YourUsername/SmartFit.git

# Инсталирай зависимостите
pip install -r requirements.txt

# Стартирай приложението
python app.py
```
