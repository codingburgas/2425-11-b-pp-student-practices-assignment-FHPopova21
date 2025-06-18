#!/usr/bin/env python3
"""
SmartFit Log Analyzer
Анализира логовете и генерира полезни отчети
"""

import os
import re
from datetime import datetime, timedelta
from collections import Counter, defaultdict
import json

class LogAnalyzer:
    def __init__(self, log_dir="instance/logs"):
        self.log_dir = log_dir
        self.reports = {}
    
    def analyze_user_actions(self):
        """Анализира потребителските действия"""
        log_file = os.path.join(self.log_dir, "user_actions.log")
        if not os.path.exists(log_file):
            return {"error": "User actions log not found"}
        
        actions = []
        users = set()
        
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                if "USER_ACTION" in line:
                    # Парсване на лог линията
                    match = re.search(r'Action: (\w+)', line)
                    if match:
                        action = match.group(1)
                        actions.append(action)
                    
                    # Извличане на User ID
                    user_match = re.search(r'User ID: (\d+)', line)
                    if user_match:
                        users.add(user_match.group(1))
        
        action_counts = Counter(actions)
        
        return {
            "total_actions": len(actions),
            "unique_users": len(users),
            "action_breakdown": dict(action_counts),
            "most_common_action": action_counts.most_common(1)[0] if action_counts else None
        }
    
    def analyze_ai_recommendations(self):
        """Анализира AI препоръките"""
        log_file = os.path.join(self.log_dir, "ai_recommendations.log")
        if not os.path.exists(log_file):
            return {"error": "AI recommendations log not found"}
        
        recommendations = []
        users = set()
        clothing_items = set()
        
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                if "AI_RECOMMENDATION" in line:
                    # Извличане на препоръка
                    rec_match = re.search(r'Recommendation: ([A-Z]+)', line)
                    if rec_match:
                        recommendations.append(rec_match.group(1))
                    
                    # Извличане на User ID
                    user_match = re.search(r'User: (\d+)', line)
                    if user_match:
                        users.add(user_match.group(1))
                    
                    # Извличане на Clothing ID
                    clothing_match = re.search(r'Clothing: ([^|]+)', line)
                    if clothing_match:
                        clothing_items.add(clothing_match.group(1).strip())
        
        rec_counts = Counter(recommendations)
        
        return {
            "total_recommendations": len(recommendations),
            "unique_users": len(users),
            "unique_clothing_items": len(clothing_items),
            "size_distribution": dict(rec_counts),
            "most_recommended_size": rec_counts.most_common(1)[0] if rec_counts else None
        }
    
    def analyze_errors(self):
        """Анализира грешките"""
        log_file = os.path.join(self.log_dir, "errors.log")
        if not os.path.exists(log_file):
            return {"error": "Errors log not found"}
        
        errors = []
        
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                if "ERROR" in line:
                    # Извличане на типа грешка
                    error_match = re.search(r'Error: ([^|]+)', line)
                    if error_match:
                        error_type = error_match.group(1).strip()
                        errors.append(error_type)
        
        error_counts = Counter(errors)
        
        return {
            "total_errors": len(errors),
            "error_types": dict(error_counts),
            "most_common_error": error_counts.most_common(1)[0] if error_counts else None
        }
    
    def analyze_performance(self):
        """Анализира производителността"""
        log_file = os.path.join(self.log_dir, "performance.log")
        if not os.path.exists(log_file):
            return {"error": "Performance log not found"}
        
        operations = defaultdict(list)
        
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                if "PERFORMANCE" in line:
                    # Извличане на операция и време
                    op_match = re.search(r'Operation: (\w+)', line)
                    duration_match = re.search(r'Duration: ([\d.]+)s', line)
                    
                    if op_match and duration_match:
                        operation = op_match.group(1)
                        duration = float(duration_match.group(1))
                        operations[operation].append(duration)
        
        performance_stats = {}
        for op, durations in operations.items():
            performance_stats[op] = {
                "count": len(durations),
                "avg_duration": sum(durations) / len(durations),
                "min_duration": min(durations),
                "max_duration": max(durations)
            }
        
        return {
            "total_operations": sum(len(durations) for durations in operations.values()),
            "operation_stats": performance_stats
        }
    
    def generate_daily_report(self):
        """Генерира дневен отчет"""
        today = datetime.now().strftime('%Y-%m-%d')
        
        report = {
            "date": today,
            "user_actions": self.analyze_user_actions(),
            "ai_recommendations": self.analyze_ai_recommendations(),
            "errors": self.analyze_errors(),
            "performance": self.analyze_performance()
        }
        
        return report
    
    def save_report(self, report, filename=None):
        """Запазва отчета в JSON файл"""
        if filename is None:
            filename = f"log_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        return filename
    
    def print_summary(self, report):
        """Принтира кратко резюме на отчета"""
        print("=" * 60)
        print("📊 SMARTFIT LOG ANALYSIS REPORT")
        print("=" * 60)
        print(f"📅 Date: {report['date']}")
        print()
        
        # User Actions
        if 'error' not in report['user_actions']:
            print("👥 USER ACTIONS:")
            print(f"   Total actions: {report['user_actions']['total_actions']}")
            print(f"   Unique users: {report['user_actions']['unique_users']}")
            if report['user_actions']['most_common_action']:
                action, count = report['user_actions']['most_common_action']
                print(f"   Most common action: {action} ({count} times)")
        print()
        
        # AI Recommendations
        if 'error' not in report['ai_recommendations']:
            print("🤖 AI RECOMMENDATIONS:")
            print(f"   Total recommendations: {report['ai_recommendations']['total_recommendations']}")
            print(f"   Unique users: {report['ai_recommendations']['unique_users']}")
            print(f"   Unique clothing items: {report['ai_recommendations']['unique_clothing_items']}")
            if report['ai_recommendations']['most_recommended_size']:
                size, count = report['ai_recommendations']['most_recommended_size']
                print(f"   Most recommended size: {size} ({count} times)")
        print()
        
        # Errors
        if 'error' not in report['errors']:
            print("❌ ERRORS:")
            print(f"   Total errors: {report['errors']['total_errors']}")
            if report['errors']['most_common_error']:
                error, count = report['errors']['most_common_error']
                print(f"   Most common error: {error[:50]}... ({count} times)")
        print()
        
        # Performance
        if 'error' not in report['performance']:
            print("⚡ PERFORMANCE:")
            print(f"   Total operations: {report['performance']['total_operations']}")
            for op, stats in report['performance']['operation_stats'].items():
                print(f"   {op}: {stats['count']} ops, avg: {stats['avg_duration']:.3f}s")
        print("=" * 60)

def main():
    """Основна функция"""
    analyzer = LogAnalyzer()
    
    print("🔍 Analyzing SmartFit logs...")
    
    # Генериране на отчет
    report = analyzer.generate_daily_report()
    
    # Принтиране на резюме
    analyzer.print_summary(report)
    
    # Запазване на пълен отчет
    filename = analyzer.save_report(report)
    print(f"📄 Full report saved to: {filename}")
    
    return report

if __name__ == "__main__":
    main() 