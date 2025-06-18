# 📝 Ръководство за Логване - SmartFit

## 🎯 Защо логваме?

Логването е критично за:

- **Отстраняване на грешки** - проследяване на проблеми
- **Мониторинг** - следване на производителността
- **Аналитика** - разбиране на поведението на потребителите
- **Сигурност** - откриване на подозрителна активност
- **AI подобрения** - анализ на препоръките

## 📁 Структура на логовете

```
instance/
└── logs/
    ├── smartfit.log          # Всички логове
    ├── errors.log            # Само грешки
    ├── ai_recommendations.log # AI препоръки
    ├── user_actions.log      # Потребителски действия
    ├── ml_model.log          # ML модел логове
    └── authentication.log    # Автентикация
```

## 🔧 Нива на логване

### DEBUG

- Детайлна информация за разработка
- Използва се само при разработка

### INFO

- Обща информация за работата на системата
- Потребителски действия
- Успешни операции

### WARNING

- Предупреждения за потенциални проблеми
- Невалидни входни данни
- Неуспешни опити за достъп

### ERROR

- Грешки които не спират приложението
- Проблеми с базата данни
- Грешки в ML модела

### CRITICAL

- Критични грешки които спират приложението
- Проблеми с конфигурацията

## 📊 Типове логове

### 1. Потребителски действия

```python
log_user_action("user_login", user_id)
log_user_action("save_measurements", user_id, "Height: 175, Weight: 70")
```

**Формат:**

```
2024-01-15 10:30:45 - USER_ACTION - Action: user_login | User ID: 123
2024-01-15 10:31:20 - USER_ACTION - Action: save_measurements | User ID: 123 | Details: Height: 175, Weight: 70
```

### 2. AI Препоръки

```python
log_ai_recommendation(user_id, clothing_id, input_data, recommendation, confidence=0.85)
```

**Формат:**

```
2024-01-15 10:32:15 - AI_RECOMMENDATION - User: 123 | Clothing: shirt_001 | Input: {'height': 175, 'weight': 70} | Recommendation: M | Confidence: 0.85
```

### 3. Производителност

```python
log_performance("size_prediction", 0.245, "Result: M")
```

**Формат:**

```
2024-01-15 10:32:15 - performance - Operation: size_prediction | Duration: 0.245s | Details: Result: M
```

### 4. Грешки

```python
log_error(exception, "Registration error")
```

**Формат:**

```
2024-01-15 10:33:00 - errors - Error: Database connection failed | Context: Registration error
```

## 🛠️ Как да използвате логването

### В routes.py

```python
from app.logging_config import log_user_action, log_error, log_ai_recommendation

@auth.route('/api/login', methods=['POST'])
def login():
    try:
        # ... код за логин ...
        log_user_action("user_login", user.id)
        return jsonify({'message': 'Success'})
    except Exception as e:
        log_error(e, "Login error")
        return jsonify({'error': str(e)}), 500
```

### В ML модула

```python
from app.logging_config import log_performance, log_error
import logging

logger = logging.getLogger('ml')

def predict_size(data):
    start_time = datetime.now()
    try:
        # ... ML логика ...
        duration = (datetime.now() - start_time).total_seconds()
        log_performance("ml_prediction", duration, f"Result: {result}")
        return result
    except Exception as e:
        log_error(e, "ML prediction error")
        return None
```

### Декоратор за автоматично логване

```python
from app.logging_config import log_function_call

@log_function_call("calculate_size")
def calculate_size(height, weight, chest, waist):
    # ... логика ...
    return size
```

## 📈 Анализ на логовете

### Често срещани заявки

**Най-активни потребители:**

```bash
grep "USER_ACTION" instance/logs/user_actions.log | awk '{print $NF}' | sort | uniq -c | sort -nr
```

**Най-популярни размери:**

```bash
grep "AI_RECOMMENDATION" instance/logs/ai_recommendations.log | grep -o "Recommendation: [A-Z]" | sort | uniq -c
```

**Грешки по тип:**

```bash
grep "ERROR" instance/logs/errors.log | awk '{print $NF}' | sort | uniq -c
```

**Производителност на операции:**

```bash
grep "performance" instance/logs/smartfit.log | grep "size_prediction" | awk '{print $NF}' | cut -d's' -f1 | sort -n
```

## 🔒 Сигурност на логовете

### Чувствителни данни

- **НЕ логвайте** пароли, токени, лични данни
- **Логвайте** само необходимата информация за дебъгване
- Използвайте маскиране за чувствителни полета

### Ротация на логовете

- Автоматична ротация на 10MB
- Запазване на последните 5 файла
- Архивиране на стари логове

### Достъп до логовете

- Само администратори имат достъп
- Логовете се съхраняват локално
- Регулярно архивиране

## 🚀 Мониторинг в продукция

### Алерти

- Грешки > 5% от заявките
- Време за отговор > 3 секунди
- ML модел грешки > 10%

### Метрики

- Брой активни потребители
- Успешност на AI препоръките
- Производителност на системата

### Доклади

- Дневни отчети за активност
- Седмични анализи на производителността
- Месечни отчети за грешки

## 📋 Best Practices

1. **Консистентност** - използвайте едни и същи формати
2. **Контекст** - добавяйте полезна информация
3. **Нива** - използвайте правилните нива на логване
4. **Производителност** - не логвайте в критични пътища
5. **Четливост** - правете логовете лесни за четене
6. **Архивиране** - редовно архивирайте стари логове

## 🔧 Конфигурация

### Промяна на нивото на логване

```python
# В app.py
logger.setLevel(logging.INFO)  # За продукция
logger.setLevel(logging.DEBUG) # За разработка
```

### Добавяне на нов лог файл

```python
# В logging_config.py
new_handler = logging.handlers.RotatingFileHandler(
    os.path.join(log_dir, 'new_module.log'),
    maxBytes=5*1024*1024,
    backupCount=3
)
```

### Промяна на формата

```python
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
```
