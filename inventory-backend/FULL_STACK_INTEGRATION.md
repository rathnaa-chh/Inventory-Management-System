# 🚀 Full Stack Setup & Integration Guide

This guide will help you set up and connect your Laravel backend with your React frontend for the Inventory Management System.

## 📋 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│         React Frontend (Vite)                           │
│         http://localhost:5173                           │
│                                                         │
│  - User Interface                                       │
│  - API Client (src/api/client.ts)                      │
│  - Services Layer                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/CORS
                     │ (Port 5173 → Port 8000)
                     │
┌────────────────────▼────────────────────────────────────┐
│         Laravel API Backend                             │
│         http://localhost:8000/api                       │
│                                                         │
│  - RESTful API Routes                                  │
│  - Controllers (ProductController, CategoryController) │
│  - Models (Product, Category, User)                    │
│  - Database (MySQL)                                     │
└─────────────────────────────────────────────────────────┘
```

## ⚡ Quick Start (5 minutes)

### Terminal 1: Start Backend
```bash
cd d:\laragon\www\inventory-backend
php artisan serve
```
✅ Backend runs on: http://localhost:8000

### Terminal 2: Start Frontend
```bash
cd "d:\Inventory Management System UI"
npm run dev
```
✅ Frontend runs on: http://localhost:5173

### ✅ That's it! 
Open http://localhost:5173 in your browser and start using the app!

---

## 📦 Complete Backend Setup

### 1. Install Dependencies
```bash
cd d:\laragon\www\inventory-backend
composer install
npm install
```

### 2. Environment Setup
The `.env` file is already configured:
```
APP_URL=http://localhost
DB_CONNECTION=mysql
DB_DATABASE=inventory
DB_USERNAME=root
DB_PASSWORD=
```

Verify MySQL is running and the "Inventory" database exists.

### 3. Generate Key & Migrate Database
```bash
php artisan key:generate
php artisan migrate
```

### 4. (Optional) Seed Sample Data
```bash
php artisan db:seed
```

### 5. Start Development Server
```bash
php artisan serve
```
- Backend API: **http://localhost:8000/api**
- Health check: http://localhost:8000/up

---

## 🎨 Complete Frontend Setup

### 1. Install Dependencies
```bash
cd "d:\Inventory Management System UI"
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
- Frontend: **http://localhost:5173**
- Automatically opens in your default browser

### 3. Verify API Connection
- The frontend is pre-configured to use `http://127.0.0.1:8000/api`
- Open DevTools (F12) → Network tab
- Perform an action (e.g., load products)
- Verify API requests are successful

---

## 🔗 Backend API Routes

Your backend provides these REST endpoints:

### Products
```
GET    /api/products              → Get all products
POST   /api/products              → Create product
GET    /api/products/{id}         → Get specific product
PUT    /api/products/{id}         → Update product
DELETE /api/products/{id}         → Delete product
```

### Categories
```
GET    /api/categories            → Get all categories
POST   /api/categories            → Create category
GET    /api/categories/{id}       → Get specific category
PUT    /api/categories/{id}       → Update category
DELETE /api/categories/{id}       → Delete category
```

**Example API Call:**
```javascript
// GET all products
fetch('http://localhost:8000/api/products')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## 🔐 CORS Configuration

CORS is already configured in `config/cors.php` to allow:
- ✅ http://localhost:5173
- ✅ http://127.0.0.1:5173
- ✅ http://localhost:3000
- ✅ http://127.0.0.1:3000

If you run the frontend on a different host/port, add it to:
```php
// config/cors.php
'allowed_origins' => [
    'http://your-frontend-url:port',
],
```

---

## 📁 Project Structure

### Backend
```
d:\laragon\www\inventory-backend\
├── app/
│   ├── Http/Controllers/API/
│   │   ├── CategoryController.php
│   │   └── ProductController.php
│   ├── Models/
│   │   ├── Product.php
│   │   └── Category.php
│   └── Providers/
├── config/
│   ├── cors.php ← ✅ CORS Configuration
│   └── database.php
├── routes/
│   └── api.php ← ✅ API Routes
├── database/
│   └── migrations/ ← ✅ Database Schema
└── .env ← ✅ Environment Variables
```

### Frontend
```
d:\Inventory Management System UI\
├── src/
│   ├── api/
│   │   ├── client.ts ← ✅ API Client
│   │   ├── services/
│   │   │   ├── categories.ts
│   │   │   ├── products.ts
│   │   │   └── ...
│   │   └── ...
│   ├── config.ts ← ✅ API Base URL
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── main.tsx
└── vite.config.ts
```

---

## 🧪 Testing the Connection

### Test 1: Backend is Running
```bash
curl http://localhost:8000/up
```
Response should be: `{"status":"ok"}`

### Test 2: Get All Categories
```bash
curl http://localhost:8000/api/categories
```
Response: `[]` or list of categories

### Test 3: Get All Products
```bash
curl http://localhost:8000/api/products
```
Response: `[]` or list of products

### Test 4: Frontend Connection
1. Open http://localhost:5173
2. Navigate to Products or Categories page
3. Check browser DevTools → Network tab
4. Verify API requests are successful (Status 200)

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Use different port if needed
php artisan serve --port=8001

# Then update frontend config: src/config.ts
export const API_BASE_URL = "http://127.0.0.1:8001/api";
```

### Database Connection Error
```bash
# Verify MySQL is running
# Check .env database credentials
# Ensure Inventory database exists

# Reconnect to database
php artisan migrate:reset
php artisan migrate
```

### CORS Errors
- Error in console? Check browser DevTools
- Verify both servers are running
- Check `config/cors.php` includes your frontend URL
- Restart backend server after changing CORS config

### Frontend Can't Connect to Backend
1. Verify backend is running: http://localhost:8000/api/categories
2. Check `src/config.ts` has correct API_BASE_URL
3. Open DevTools → Network tab
4. Check request URL and response status
5. Check response for error message

### Port Already in Use
```bash
# Find what's using the port
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different port
php artisan serve --port=8001
npm run dev -- --port=3001
```

---

## 📝 Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id BIGINT NOT NULL,
  price DECIMAL(10, 2),
  quantity INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

---

## 🚀 Running Both Servers Together

### Option 1: Use Provided npm Script
```bash
cd d:\laragon\www\inventory-backend
npm run dev
```
This runs PHP server, queue listener, logs, and Vite in one terminal.

### Option 2: Separate Terminals
**Terminal 1:**
```bash
cd d:\laragon\www\inventory-backend
php artisan serve
```

**Terminal 2:**
```bash
cd "d:\Inventory Management System UI"
npm run dev
```

---

## 📚 Additional Resources

### Backend Documentation
- Laravel Docs: https://laravel.com/docs
- API Routes: `d:\laragon\www\inventory-backend\routes\api.php`
- Setup Guide: `d:\laragon\www\inventory-backend\BACKEND_SETUP.md`

### Frontend Documentation
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Setup Guide: `d:\Inventory Management System UI\FRONTEND_SETUP.md`
- Component Guide: `d:\Inventory Management System UI\COMPONENT_USAGE_GUIDE.md`
- Design System: `d:\Inventory Management System UI\DESIGN_DOCUMENTATION.md`

---

## ✅ Integration Checklist

- [x] Backend dependencies installed
- [x] Frontend dependencies installed
- [x] Database migrations created
- [x] API routes configured
- [x] CORS configuration added
- [x] Frontend API client setup
- [ ] Database seeded with data
- [ ] Backend server running (port 8000)
- [ ] Frontend server running (port 5173)
- [ ] API calls working in browser
- [ ] All pages loading data correctly
- [ ] No console errors

---

## 🎉 Success!

If both servers are running and data is loading in the UI, you're all set! 

Your Inventory Management System is now fully connected and ready to use.

**Questions?** Check the setup guides in each project folder or review the troubleshooting section above.
