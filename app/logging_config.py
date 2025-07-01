import logging
import logging.handlers
import os
from datetime import datetime

def setup_logging(app):
    """
    Конфигурира логването за Flask приложението и създава нужните лог файлове и handlers.
    :param app: Flask приложение
    :return: Главният логър
    """
    
    # Създаваме директория за логове ако не съществува
    log_dir = os.path.join(app.instance_path, 'logs')
    os.makedirs(log_dir, exist_ok=True)
    
    # Конфигурация на основния логър
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    
    # Премахваме съществуващи handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
    
    # Формат на логовете
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console Handler (за разработка)
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File Handler за всички логове
    all_logs_handler = logging.handlers.RotatingFileHandler(
        os.path.join(log_dir, 'smartfit.log'),
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    all_logs_handler.setLevel(logging.DEBUG)
    all_logs_handler.setFormatter(formatter)
    logger.addHandler(all_logs_handler)
    
    # File Handler за грешки
    error_handler = logging.handlers.RotatingFileHandler(
        os.path.join(log_dir, 'errors.log'),
        maxBytes=5*1024*1024,  # 5MB
        backupCount=3
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    logger.addHandler(error_handler)
    
    # Специфични логъри за различни модули
    setup_module_loggers(log_dir, formatter)
    
    return logger

def setup_module_loggers(log_dir, formatter):
    """
    Настройва специфични логъри за различни модули.
    :param log_dir: Директория за лог файловете
    :param formatter: Формат на логовете
    """
    
    # Логър за ML модула
    ml_logger = logging.getLogger('ml')
    ml_logger.setLevel(logging.DEBUG)
    
    ml_handler = logging.handlers.RotatingFileHandler(
        os.path.join(log_dir, 'ml_model.log'),
        maxBytes=5*1024*1024,
        backupCount=3
    )
    ml_handler.setFormatter(formatter)
    ml_logger.addHandler(ml_handler)
    
    # Логър за автентикация
    auth_logger = logging.getLogger('auth')
    auth_logger.setLevel(logging.INFO)
    
    auth_handler = logging.handlers.RotatingFileHandler(
        os.path.join(log_dir, 'authentication.log'),
        maxBytes=5*1024*1024,
        backupCount=3
    )
    auth_handler.setFormatter(formatter)
    auth_logger.addHandler(auth_handler)

def log_user_action(action, user_id=None, details=None):
    """
    Логва действие на потребител.
    :param action: Името на действието
    :param user_id: ID на потребителя (по избор)
    :param details: Допълнителни детайли (по избор)
    """
    logger = logging.getLogger('user_actions')
    logger.setLevel(logging.INFO)
    
    # Създаваме handler само ако не съществува
    if not logger.handlers:
        log_dir = os.path.join(os.getcwd(), 'instance', 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        user_handler = logging.handlers.RotatingFileHandler(
            os.path.join(log_dir, 'user_actions.log'),
            maxBytes=5*1024*1024,
            backupCount=3
        )
        user_formatter = logging.Formatter(
            '%(asctime)s - USER_ACTION - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        user_handler.setFormatter(user_formatter)
        logger.addHandler(user_handler)
    
    message = f"Action: {action}"
    if user_id:
        message += f" | User ID: {user_id}"
    if details:
        message += f" | Details: {details}"
    logger.info(message)

def log_ai_recommendation(user_id, clothing_id, input_data, recommendation, confidence=None):
    """
    Логва AI препоръка за размер.
    :param user_id: ID на потребителя
    :param clothing_id: ID на дрехата
    :param input_data: Входни данни
    :param recommendation: Препоръчан размер
    :param confidence: Доверие (по избор)
    """
    logger = logging.getLogger('ai_recommendations')
    logger.setLevel(logging.INFO)
    
    # Създаваме handler само ако не съществува
    if not logger.handlers:
        log_dir = os.path.join(os.getcwd(), 'instance', 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        ai_handler = logging.handlers.RotatingFileHandler(
            os.path.join(log_dir, 'ai_recommendations.log'),
            maxBytes=5*1024*1024,
            backupCount=3
        )
        ai_formatter = logging.Formatter(
            '%(asctime)s - AI_RECOMMENDATION - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        ai_handler.setFormatter(ai_formatter)
        logger.addHandler(ai_handler)
    
    message = f"User: {user_id} | Clothing: {clothing_id} | Input: {input_data} | Recommendation: {recommendation}"
    if confidence:
        message += f" | Confidence: {confidence}"
    logger.info(message)

def log_error(error, context=None):
    """
    Логва грешка с контекст.
    :param error: Грешката
    :param context: Контекст (по избор)
    """
    logger = logging.getLogger('errors')
    logger.setLevel(logging.ERROR)
    
    # Създаваме handler само ако не съществува
    if not logger.handlers:
        log_dir = os.path.join(os.getcwd(), 'instance', 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        error_handler = logging.handlers.RotatingFileHandler(
            os.path.join(log_dir, 'errors.log'),
            maxBytes=5*1024*1024,
            backupCount=3
        )
        error_formatter = logging.Formatter(
            '%(asctime)s - ERROR - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        error_handler.setFormatter(error_formatter)
        logger.addHandler(error_handler)
    
    message = f"Error: {str(error)}"
    if context:
        message += f" | Context: {context}"
    logger.error(message, exc_info=True)

def log_performance(operation, duration, details=None):
    """
    Логва производителност на операции.
    :param operation: Операция
    :param duration: Време за изпълнение
    :param details: Детайли (по избор)
    """
    logger = logging.getLogger('performance')
    logger.setLevel(logging.INFO)
    
    # Създаваме handler само ако не съществува
    if not logger.handlers:
        log_dir = os.path.join(os.getcwd(), 'instance', 'logs')
        os.makedirs(log_dir, exist_ok=True)
        
        perf_handler = logging.handlers.RotatingFileHandler(
            os.path.join(log_dir, 'performance.log'),
            maxBytes=5*1024*1024,
            backupCount=3
        )
        perf_formatter = logging.Formatter(
            '%(asctime)s - PERFORMANCE - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        perf_handler.setFormatter(perf_formatter)
        logger.addHandler(perf_handler)
    
    message = f"Operation: {operation} | Duration: {duration:.3f}s"
    if details:
        message += f" | Details: {details}"
    logger.info(message)

# Декоратор за логване на функции
def log_function_call(func_name):
    """
    Декоратор за автоматично логване на извиквания на функции.
    :param func_name: Име на функцията
    :return: Декоратор
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            logger = logging.getLogger('function_calls')
            start_time = datetime.now()
            
            try:
                result = func(*args, **kwargs)
                duration = (datetime.now() - start_time).total_seconds()
                logger.info(f"Function: {func_name} | Duration: {duration:.3f}s | Status: SUCCESS")
                return result
            except Exception as e:
                duration = (datetime.now() - start_time).total_seconds()
                logger.error(f"Function: {func_name} | Duration: {duration:.3f}s | Status: ERROR | Error: {str(e)}")
                raise
                
        return wrapper
    return decorator 