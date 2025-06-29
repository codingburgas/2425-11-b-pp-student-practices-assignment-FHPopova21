from flask import Blueprint, jsonify, request
from app.models import db, Comment, RecommendationHistory
from flask_login import login_required, current_user
import logging

comment_bp = Blueprint('comment_bp', __name__)
logger = logging.getLogger('comment_bp')

@comment_bp.route('/clothing/<int:clothing_id>/comments', methods=['GET'])
def get_clothing_comments(clothing_id):
    comments = Comment.query.filter_by(clothing_id=clothing_id).order_by(Comment.created_at.desc()).all()
    return jsonify([c.to_dict() for c in comments]), 200

@comment_bp.route('/clothing/<int:clothing_id>/comments', methods=['POST'])
@login_required
def add_clothing_comment(clothing_id):
    data = request.get_json()
    content = data.get('content')
    rating = data.get('rating')
    logger.info(f'User {current_user.id} tries to comment on clothing {clothing_id} with content: {content}')
    if not content:
        logger.warning('Empty comment content')
        return jsonify({'error': 'Коментарът не може да е празен.'}), 400
    rec = RecommendationHistory.query.filter_by(user_id=current_user.id, item_identifier=str(clothing_id)).first()
    logger.info(f'Recommendation found: {rec is not None}')
    if not rec:
        logger.warning('No recommendation found for this clothing')
        return jsonify({'error': 'Може да коментирате само ако имате препоръка за тази дреха.'}), 403
    try:
        comment = Comment(user_id=current_user.id, clothing_id=clothing_id, content=content, rating=rating)
        db.session.add(comment)
        db.session.commit()
        logger.info(f'Comment saved! ID: {comment.id}')
        return jsonify({'message': 'Коментарът е добавен успешно.', 'comment': comment.to_dict()}), 201
    except Exception as e:
        logger.error(f'Error saving comment: {e}')
        db.session.rollback()
        return jsonify({'error': f'Грешка при запис на коментар: {str(e)}'}), 500 