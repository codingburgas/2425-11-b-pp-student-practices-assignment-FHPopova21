# 🔒 Administrator Guide - SmartFit

## Overview

The SmartFit application now includes a comprehensive administrator system that allows full management of users, clothes, comments, and recommendations.

## 🎯 Default Admin Credentials

- **Username**: `FHPopova21`
- **Password**: `Vuk80492`
- **Email**: `fhpopova21@codingburgas.bg`
- **Role**: `admin`

## 🛠️ Features Implemented

### 1. **Database Models**

- ✅ **User Model**: Extended to support `admin` role
- ✅ **Clothing Model**: New model for managing clothes
- ✅ **Comment Model**: New model for user comments and ratings
- ✅ **RecommendationHistory Model**: Existing model for AI recommendations

### 2. **Backend API Endpoints**

- ✅ `/api/admin/dashboard` - Get dashboard statistics
- ✅ `/api/admin/users` - Get all users
- ✅ `/api/admin/clothes` - Get all clothes
- ✅ `/api/admin/comments` - Get all comments
- ✅ `/api/admin/recommendations` - Get all recommendations
- ✅ `/api/admin/users/<id>` - Delete user
- ✅ `/api/admin/clothes/<id>` - Delete clothing
- ✅ `/api/admin/comments/<id>` - Delete comment

### 3. **Frontend Admin Dashboard**

- ✅ **Dashboard Overview**: Statistics cards showing counts
- ✅ **Users Management**: View and delete users (except admins)
- ✅ **Clothes Management**: View and delete clothes
- ✅ **Comments Management**: View and delete comments with ratings
- ✅ **Recommendations View**: View all AI recommendations

### 4. **Security & Access Control**

- ✅ **Admin Decorator**: `@admin_required` for protected routes
- ✅ **Role-based Redirects**: Admin users redirected to `/admin` after login
- ✅ **Protected Routes**: All admin routes require admin authentication

## 🚀 Getting Started

### 1. **Database Setup**

The admin user and sample data are automatically created when you run the application:

```bash
python app.py
```

Or test the seeding separately:

```bash
python test_seed.py
```

### 2. **Login as Admin**

1. Navigate to the login page
2. Use the default admin credentials:
   - Username: `FHPopova21`
   - Password: `Vuk80492`
3. You'll be automatically redirected to `/admin`

### 3. **Access Admin Dashboard**

The admin dashboard is available at `/admin` and includes:

- **Statistics Overview**: Real-time counts of users, clothes, comments, and recommendations
- **Tabbed Interface**: Organized sections for different data types
- **Delete Actions**: Remove users, clothes, and comments as needed

## 📊 Dashboard Features

### **Statistics Cards**

- **Users Count**: Total registered users
- **Clothes Count**: Total clothing items
- **Comments Count**: Total user comments
- **Recommendations Count**: Total AI recommendations

### **Users Tab**

- View all registered users
- See user roles (Admin, Seller, User)
- Delete users (except admin users)
- User information: ID, username, email, role

### **Clothes Tab**

- View all clothing items
- Clothing details: name, type, size, price, seller
- Delete clothing items
- Organized by seller

### **Comments Tab**

- View all user comments
- Star ratings display
- Comment content and metadata
- Delete inappropriate comments

### **Recommendations Tab**

- View all AI-generated recommendations
- Recommendation details: clothing type, size, date, user
- Historical data for analysis

## 🔧 Technical Implementation

### **Backend Structure**

```
app/
├── models.py          # Database models (User, Clothing, Comment)
├── routes.py          # API endpoints including admin routes
├── decorators.py      # Admin access control decorators
├── seed.py           # Database seeding with admin user
└── app.py            # Main application with seeding
```

### **Frontend Structure**

```
PresentationLayer/src/
├── pages/
│   └── AdminDashboard.tsx    # Main admin interface
├── store/
│   └── authStore.ts          # Updated for admin role
└── types/
    └── index.ts              # Updated type definitions
```

### **Database Schema**

```sql
-- Users table (extended)
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(128),
    role VARCHAR(20) DEFAULT 'user'  -- 'user', 'seller', 'admin'
);

-- Clothing table (new)
CREATE TABLE clothing (
    id INTEGER PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    material VARCHAR(50) NOT NULL,
    size VARCHAR(10) NOT NULL,
    width FLOAT NOT NULL,
    length FLOAT NOT NULL,
    sleeves FLOAT,
    price FLOAT,
    description TEXT,
    image_url VARCHAR(500),
    seller_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comments table (new)
CREATE TABLE comment (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    rating INTEGER,
    user_id INTEGER NOT NULL,
    clothing_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🛡️ Security Considerations

### **Access Control**

- Admin routes are protected with `@admin_required` decorator
- Only authenticated admin users can access admin functionality
- Admin users cannot be deleted through the interface

### **Data Protection**

- All admin actions are logged for audit purposes
- Confirmation dialogs for destructive actions
- Proper error handling and user feedback

### **Role Validation**

- Registration validates role types (`user`, `seller`, `admin`)
- Login redirects based on user role
- Navigation shows appropriate admin links

## 📝 Sample Data

The seeding script creates:

- **1 Admin User**: FHPopova21
- **3 Seller Users**: fashion_store_bg, sport_world, elegant_lady
- **5 Sample Clothes**: Various clothing items with different types and sellers
- **3 Sample Comments**: User reviews with ratings

## 🔄 API Endpoints Reference

### **GET /api/admin/dashboard**

Returns dashboard statistics and recent activity.

### **GET /api/admin/users**

Returns all users in the system.

### **GET /api/admin/clothes**

Returns all clothing items.

### **GET /api/admin/comments**

Returns all user comments.

### **GET /api/admin/recommendations**

Returns all AI recommendations.

### **DELETE /api/admin/users/{id}**

Deletes a user (except admin users).

### **DELETE /api/admin/clothes/{id}**

Deletes a clothing item and related comments.

### **DELETE /api/admin/comments/{id}**

Deletes a comment.

## 🎉 Success Criteria Met

- ✅ **Pre-created administrator**: FHPopova21 with specified credentials
- ✅ **Admin dashboard**: Complete interface at `/admin`
- ✅ **Role-based redirect**: Admin users redirected to `/admin/dashboard`
- ✅ **All users view**: Complete user management
- ✅ **All comments view**: Comment management with ratings
- ✅ **All clothes view**: Clothing management with seller information
- ✅ **All recommendations view**: AI recommendation history

The administrator functionality is now fully implemented and ready for use!
