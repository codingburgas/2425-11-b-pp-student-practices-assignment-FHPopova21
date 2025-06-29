#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from app.seed import seed_database

if __name__ == '__main__':
    with app.app_context():
        print("Testing database seeding...")
        try:
            seed_database()
            print("✅ Database seeded successfully!")
            
            # Test if admin user was created
            from app.models import User
            admin = User.query.filter_by(username='FHPopova21').first()
            if admin:
                print(f"✅ Admin user created: {admin.username} ({admin.role})")
            else:
                print("❌ Admin user not found")
                
        except Exception as e:
            print(f"❌ Error seeding database: {e}")
            import traceback
            traceback.print_exc() 