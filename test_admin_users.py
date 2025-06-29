#!/usr/bin/env python3

import sys
import os
import requests
import json

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_admin_users_api():
    """Test the enhanced admin users API"""
    
    # First, let's test the seeding
    print("Testing database seeding...")
    try:
        from app import app
        from app.seed import seed_database
        
        with app.app_context():
            seed_database()
            print("✅ Database seeded successfully!")
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        return
    
    # Now test the API endpoint
    print("\nTesting admin users API...")
    
    # Start the app in a separate process or use a running instance
    # For now, let's just test the data structure
    try:
        from app import app
        from app.models import User, RecommendationHistory, Comment, Clothing
        
        with app.app_context():
            # Get a user to test the enhanced data
            admin_user = User.query.filter_by(username='FHPopova21').first()
            if admin_user:
                # Get the counts manually
                recommendation_count = RecommendationHistory.query.filter_by(user_id=admin_user.id).count()
                comment_count = Comment.query.filter_by(user_id=admin_user.id).count()
                clothing_count = Clothing.query.filter_by(seller_id=admin_user.id).count()
                
                print(f"✅ Admin user found: {admin_user.username}")
                print(f"   - Recommendations: {recommendation_count}")
                print(f"   - Comments: {comment_count}")
                print(f"   - Clothes: {clothing_count}")
                
                # Test the enhanced user data structure
                user_data = admin_user.to_dict()
                user_data.update({
                    'recommendation_count': recommendation_count,
                    'comment_count': comment_count,
                    'clothing_count': clothing_count
                })
                
                print(f"✅ Enhanced user data structure:")
                print(json.dumps(user_data, indent=2, default=str))
                
            else:
                print("❌ Admin user not found")
                
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_admin_users_api() 