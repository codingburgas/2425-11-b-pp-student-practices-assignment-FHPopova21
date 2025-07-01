from flask import Blueprint, jsonify, request
from app.models import User, db, RecommendationHistory, BodyMeasurements, Clothing, Comment
from flask_login import login_required, current_user
from app.decorators import admin_required
from app.logging_config import log_user_action, log_error
import logging

admin_bp = Blueprint('admin_bp', __name__)
"""
Blueprint за всички админ маршрути: управление на потребители, дрехи, коментари и препоръки.
"""
logger = logging.getLogger('admin_bp')

@admin_bp.route('/admin/users')
@login_required
@admin_required
def get_all_users():
    try:
        users = User.query.all()
        users_with_stats = []
        for user in users:
            recommendation_count = RecommendationHistory.query.filter_by(user_id=user.id).count()
            comment_count = Comment.query.filter_by(user_id=user.id).count()
            clothing_count = Clothing.query.filter_by(seller_id=user.id).count()
            user_data = user.to_dict()
            user_data.update({
                'recommendation_count': recommendation_count,
                'comment_count': comment_count,
                'clothing_count': clothing_count
            })
            users_with_stats.append(user_data)
        log_user_action("admin_get_users", current_user.id, f"Count: {len(users)}")
        return jsonify(users_with_stats), 200
    except Exception as e:
        log_error(e, "Admin get users error")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/clothes')
@login_required
@admin_required
def get_all_clothes():
    """
    Връща списък с всички дрехи.
    Метод: GET
    Изход: JSON с всички дрехи
    """
    try:
        clothes = Clothing.query.all()
        log_user_action("admin_get_clothes", current_user.id, f"Count: {len(clothes)}")
        return jsonify([clothing.to_dict() for clothing in clothes]), 200
    except Exception as e:
        log_error(e, "Admin get clothes error")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/comments')
@login_required
@admin_required
def get_all_comments():
    try:
        comments = Comment.query.all()
        log_user_action("admin_get_comments", current_user.id, f"Count: {len(comments)}")
        return jsonify([comment.to_dict() for comment in comments]), 200
    except Exception as e:
        log_error(e, "Admin get comments error")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/recommendations')
@login_required
@admin_required
def get_all_recommendations():
    try:
        recommendations = RecommendationHistory.query.all()
        log_user_action("admin_get_recommendations", current_user.id, f"Count: {len(recommendations)}")
        return jsonify([rec.to_dict() for rec in recommendations]), 200
    except Exception as e:
        log_error(e, "Admin get recommendations error")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/dashboard')
@login_required
@admin_required
def admin_dashboard():
    try:
        user_count = User.query.count()
        clothes_count = Clothing.query.count()
        comments_count = Comment.query.count()
        recommendations_count = RecommendationHistory.query.count()
        recent_users = User.query.order_by(User.id.desc()).limit(5).all()
        recent_clothes = Clothing.query.order_by(Clothing.created_at.desc()).limit(5).all()
        recent_comments = Comment.query.order_by(Comment.created_at.desc()).limit(5).all()
        dashboard_data = {
            'counts': {
                'users': user_count,
                'clothes': clothes_count,
                'comments': comments_count,
                'recommendations': recommendations_count
            },
            'recent': {
                'users': [user.to_dict() for user in recent_users],
                'clothes': [clothing.to_dict() for clothing in recent_clothes],
                'comments': [comment.to_dict() for comment in recent_comments]
            }
        }
        log_user_action("admin_dashboard_access", current_user.id)
        return jsonify(dashboard_data), 200
    except Exception as e:
        log_error(e, "Admin dashboard error")
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        if user.role == 'admin':
            return jsonify({'error': 'Cannot delete admin user'}), 400
        BodyMeasurements.query.filter_by(user_id=user_id).delete()
        RecommendationHistory.query.filter_by(user_id=user_id).delete()
        Comment.query.filter_by(user_id=user_id).delete()
        Clothing.query.filter_by(seller_id=user_id).delete()
        db.session.delete(user)
        db.session.commit()
        log_user_action("admin_delete_user", current_user.id, f"Deleted user: {user_id}")
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        log_error(e, "Admin delete user error")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/clothes/<int:clothing_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_clothing(clothing_id):
    """
    Изтрива дреха по ID.
    Метод: DELETE
    Вход: clothing_id (URL параметър)
    Изход: JSON със статус
    """
    try:
        clothing = Clothing.query.get(clothing_id)
        if not clothing:
            return jsonify({'error': 'Clothing not found'}), 404
        Comment.query.filter_by(clothing_id=clothing_id).delete()
        db.session.delete(clothing)
        db.session.commit()
        log_user_action("admin_delete_clothing", current_user.id, f"Deleted clothing: {clothing_id}")
        return jsonify({'message': 'Clothing deleted successfully'}), 200
    except Exception as e:
        log_error(e, "Admin delete clothing error")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/comments/<int:comment_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_comment(comment_id):
    try:
        comment = Comment.query.get(comment_id)
        if not comment:
            return jsonify({'error': 'Comment not found'}), 404
        db.session.delete(comment)
        db.session.commit()
        log_user_action("admin_delete_comment", current_user.id, f"Deleted comment: {comment_id}")
        return jsonify({'message': 'Comment deleted successfully'}), 200
    except Exception as e:
        log_error(e, "Admin delete comment error")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500 