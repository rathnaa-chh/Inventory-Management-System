# Frontend Setup Guide

## Overview
Your React + TypeScript frontend is configured to communicate with the Laravel backend API at `http://localhost:8000/api`.

## Prerequisites
- Node.js 18+ and npm (or pnpm)
- Backend running on `http://localhost:8000`

## Step 1: Install Dependencies

```bash
cd "d:\Inventory Management System UI"

# Using npm
npm install

# OR using pnpm (if configured)
pnpm install
```

## Step 2: Verify Backend Connection Configuration

The frontend is configured to connect to the backend at:
- **Location**: `src/config.ts`
- **API Base URL**: `http://127.0.0.1:8000/api`

```typescript
export const API_BASE_URL = "http://127.0.0.1:8000/api";
```

This is already set correctly and matches the backend's API port.

## Step 3: Start the Development Server

```bash
cd "d:\Inventory Management System UI"

# Using npm
npm run dev

# OR using pnpm
pnpm dev
```

The frontend will typically be available at: **http://localhost:5173**

(If port 5173 is busy, Vite will use the next available port)

## Step 4: Test the Connection

Once both servers are running:

1. Open `http://localhost:5173` in your browser
2. Navigate to the Products or Categories pages
3. The UI should successfully fetch data from the backend API
4. Check browser console (F12 → Console) for any errors

## API Client Setup

The frontend uses a custom API client (`src/api/client.ts`) that:
- ✅ Handles all HTTP methods (GET, POST, PUT, DELETE)
- ✅ Automatically adds Authorization headers from localStorage
- ✅ Uses Bearer token authentication
- ✅ Handles responses and errors

### Service Layer
API calls are organized in `src/api/services/`:
- `categories.ts` - Category operations
- `products.ts` - Product operations
- `auth.ts` - Authentication
- `stock.ts` - Stock management
- `index.ts` - Exports all services

## Environment Variables

If you need to customize the backend URL for different environments:

1. Create a `.env.local` file in the project root
2. Add custom configuration if needed

Example:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

Then update `src/config.ts` to use the env variable.

## Available Pages & Features

- **Dashboard** - Overview and statistics
- **Products** - Product management (CRUD)
- **Categories** - Category management (CRUD)
- **Stock In** - Receive inventory
- **Stock Out** - Dispense inventory
- **Transaction History** - View all transactions
- **Users** - User management (Admin)
- **Reports** - Analytics and reports
- **Profile** - User profile management

## Troubleshooting

### Backend Connection Errors
- Verify backend is running on `http://localhost:8000`
- Check CORS configuration in backend: `config/cors.php`
- Ensure frontend URL is in CORS allowed origins

### API Errors in Console
- Check Network tab in browser DevTools
- Verify request URLs match backend routes
- Check Authorization headers if using authentication

### Port Already in Use
Vite will automatically use the next available port if 5173 is busy.

To specify a custom port:
```bash
npm run dev -- --port 3000
```

## Building for Production

```bash
npm run build
```

This creates optimized files in the `dist/` directory ready for deployment.

## Component Documentation

Refer to `COMPONENT_USAGE_GUIDE.md` for detailed information about all available components and how to use them.

## Design System

- **Framework**: Tailwind CSS + shadcn/ui
- **Theme**: Configured in `tailwind.config.ts`
- **Default Theme**: `default_shadcn_theme.css`
- **Guidelines**: See `guidelines/Guidelines.md`

## Next Steps

1. ✅ Frontend dependencies installed
2. ✅ Backend running on port 8000
3. → Run `npm run dev` to start the frontend
4. → Open http://localhost:5173 and test the application
5. → Check browser console for any errors

## Need Help?

- Check `README.md` for quick start
- See `QUICKSTART.md` for rapid setup
- Review `DESIGN_DOCUMENTATION.md` for design details
- Check `IMPLEMENTATION_SUMMARY.md` for feature overview
