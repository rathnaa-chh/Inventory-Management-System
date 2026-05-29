# Backend Setup Guide

## Overview
Your Laravel backend is now configured to work with the React frontend. The setup includes:
- ✅ CORS configuration for cross-origin requests
- ✅ API routes with full CRUD support
- ✅ Database migrations ready
- ✅ API controllers for Products and Categories

## Prerequisites
- PHP 8.3+
- Composer
- MySQL (running locally)
- Node.js (for frontend)

## Step 1: Install Backend Dependencies

```bash
cd d:\laragon\www\inventory-backend

# Install PHP dependencies
composer install

# Install Node dependencies (for Vite bundling)
npm install
```

## Step 2: Configure Environment Variables

The `.env` file is already configured, but verify these settings:

```env
APP_URL=http://localhost
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=Inventory
DB_USERNAME=root
DB_PASSWORD=
```

Make sure your MySQL database "Inventory" exists and is running.

## Step 3: Generate Application Key

```bash
php artisan key:generate
```

## Step 4: Run Database Migrations

```bash
php artisan migrate
```

This will create the following tables:
- users
- categories
- products
- cache
- jobs
- sessions

## Step 5: Start the Development Server

```bash
php artisan serve
```

The backend will be available at: **http://localhost:8000**

The API will be accessible at: **http://localhost:8000/api**

### Available API Endpoints

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a category
- `GET /api/categories/{id}` - Get a specific category
- `PUT /api/categories/{id}` - Update a category
- `DELETE /api/categories/{id}` - Delete a category

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a product
- `GET /api/products/{id}` - Get a specific product
- `PUT /api/products/{id}` - Update a product
- `DELETE /api/products/{id}` - Delete a product

## Step 6: Seed Sample Data (Optional)

If you want to populate the database with sample data:

```bash
php artisan db:seed
```

## CORS Configuration

CORS is already configured to allow requests from:
- `http://localhost:5173` (Frontend dev server)
- `http://127.0.0.1:5173`
- `http://localhost:3000` (Alternative port)
- `http://127.0.0.1:3000`

The configuration file is at: `config/cors.php`

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Verify the database "Inventory" exists
- Check DB credentials in `.env`

### CORS Errors
- Ensure the backend is running on port 8000
- Check that your frontend is running on port 5173 (default Vite port)
- Verify `config/cors.php` includes your frontend URL

### Port Already in Use
If port 8000 is already in use, specify a different port:
```bash
php artisan serve --port=8001
```
Then update the frontend's `src/config.ts` to use the new port.

## Next Steps

1. ✅ Backend setup complete
2. → Go to Frontend Setup (`d:\Inventory Management System UI\FRONTEND_SETUP.md`)
3. → Run both servers and test the connection

## Running Everything Together

Use the built-in dev command to run backend + queue + logs + vite:

```bash
npm run dev
```

This uses concurrently to run:
- PHP server on port 8000
- Queue listener
- Pail logs
- Vite on port 5173
