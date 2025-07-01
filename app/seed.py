from .models import db, User, Clothing, Comment
from werkzeug.security import generate_password_hash
from datetime import datetime

def seed_database():
    """
    Зарежда начални данни в базата: админ, продавачи, дрехи и коментари.
    """
    
    # Check if admin already exists
    admin = User.query.filter_by(username='FHPopova21').first()
    if not admin:
        # Create default admin user
        admin = User(
            username='FHPopova21',
            email='fhpopova21@codingburgas.bg',
            role='admin'
        )
        admin.set_password('Vuk80492')
        db.session.add(admin)
        print("Created admin user: FHPopova21")
    
    # Create some sample sellers if they don't exist
    sellers_data = [
        {
            'username': 'fashion_store_bg',
            'email': 'fashion@store.bg',
            'password': 'password123',
            'role': 'seller'
        },
        {
            'username': 'sport_world',
            'email': 'info@sportworld.bg',
            'password': 'password123',
            'role': 'seller'
        },
        {
            'username': 'elegant_lady',
            'email': 'contact@elegantlady.bg',
            'password': 'password123',
            'role': 'seller'
        }
    ]
    
    for seller_data in sellers_data:
        seller = User.query.filter_by(username=seller_data['username']).first()
        if not seller:
            seller = User(
                username=seller_data['username'],
                email=seller_data['email'],
                role=seller_data['role']
            )
            seller.set_password(seller_data['password'])
            db.session.add(seller)
            print(f"Created seller: {seller_data['username']}")
    
    # Create some sample clothes if they don't exist
    clothes_data = [
        {
            'name': 'Класическа бизнес риза',
            'type': 'shirt',
            'material': 'non-elastic',
            'size': 'M',
            'width': 52,
            'length': 75,
            'sleeves': 65,
            'price': 89,
            'description': 'Елегантна бяла риза за официални случаи',
            'seller_username': 'fashion_store_bg'
        },
        {
            'name': 'Спортна тениска',
            'type': 'shirt',
            'material': 'elastic',
            'size': 'L',
            'width': 55,
            'length': 70,
            'sleeves': 25,
            'price': 45,
            'description': 'Комфортна тениска за тренировки',
            'seller_username': 'sport_world'
        },
        {
            'name': 'Дамска рокля',
            'type': 'dress',
            'material': 'semi-elastic',
            'size': 'S',
            'width': 46,
            'length': 95,
            'sleeves': 60,
            'price': 120,
            'description': 'Стилна рокля за специални поводи',
            'seller_username': 'elegant_lady'
        },
        {
            'name': 'Джинсов панталон',
            'type': 'pants',
            'material': 'non-elastic',
            'size': 'M',
            'width': 42,
            'length': 100,
            'price': 95,
            'description': 'Класически дънки с перфектен крой',
            'seller_username': 'fashion_store_bg'
        },
        {
            'name': 'Зимно яке',
            'type': 'jacket',
            'material': 'non-elastic',
            'size': 'L',
            'width': 58,
            'length': 68,
            'sleeves': 68,
            'price': 180,
            'description': 'Топло яке за студените дни',
            'seller_username': 'fashion_store_bg'
        }
    ]
    
    for clothing_data in clothes_data:
        # Check if clothing already exists
        existing_clothing = Clothing.query.filter_by(
            name=clothing_data['name'],
            seller_id=User.query.filter_by(username=clothing_data['seller_username']).first().id
        ).first()
        
        if not existing_clothing:
            seller = User.query.filter_by(username=clothing_data['seller_username']).first()
            if seller:
                clothing = Clothing(
                    name=clothing_data['name'],
                    type=clothing_data['type'],
                    material=clothing_data['material'],
                    size=clothing_data['size'],
                    width=clothing_data['width'],
                    length=clothing_data['length'],
                    sleeves=clothing_data.get('sleeves'),
                    price=clothing_data['price'],
                    description=clothing_data['description'],
                    seller_id=seller.id
                )
                db.session.add(clothing)
                print(f"Created clothing: {clothing_data['name']}")
    
    # Create some sample comments if they don't exist
    comments_data = [
        {
            'content': 'Отлична риза, перфектен размер!',
            'rating': 5,
            'user_username': 'FHPopova21',
            'clothing_name': 'Класическа бизнес риза'
        },
        {
            'content': 'Много удобна тениска за тренировки',
            'rating': 4,
            'user_username': 'FHPopova21',
            'clothing_name': 'Спортна тениска'
        },
        {
            'content': 'Красива рокля, препоръчвам!',
            'rating': 5,
            'user_username': 'FHPopova21',
            'clothing_name': 'Дамска рокля'
        }
    ]
    
    for comment_data in comments_data:
        # Check if comment already exists
        user = User.query.filter_by(username=comment_data['user_username']).first()
        clothing = Clothing.query.filter_by(name=comment_data['clothing_name']).first()
        
        if user and clothing:
            existing_comment = Comment.query.filter_by(
                user_id=user.id,
                clothing_id=clothing.id,
                content=comment_data['content']
            ).first()
            
            if not existing_comment:
                comment = Comment(
                    content=comment_data['content'],
                    rating=comment_data['rating'],
                    user_id=user.id,
                    clothing_id=clothing.id
                )
                db.session.add(comment)
                print(f"Created comment for {comment_data['clothing_name']}")
    
    try:
        db.session.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error seeding database: {e}")
        raise 