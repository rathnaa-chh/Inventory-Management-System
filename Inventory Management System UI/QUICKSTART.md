# 🚀 Quick Start Guide

## Welcome to Inventory Management System UI!

This guide will help you get up and running in minutes.

---

## Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org))
- **pnpm** 7+ (install via: `npm install -g pnpm`)
- **Git** (optional)

---

## Installation & Setup

### Option 1: Automatic Setup

```bash
# Linux/Mac
chmod +x QUICKSTART.sh
./QUICKSTART.sh

# Windows
# Run commands manually from Option 2 below
```

### Option 2: Manual Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev

# 3. Open in browser
# Visit http://localhost:5173
```

---

## First Steps

1. **Default Login Credentials**
   - Role: Admin (switchable)
   - Name: Admin User
   - Email: admin@inventory.sys

2. **Explore the Dashboard**
   - Click on different menu items
   - Try switching roles in sidebar

3. **Try the Role Switcher**
   - Sidebar → "Switch Role" button
   - Select: Admin, Staff, or Manager
   - Notice menu items change per role

4. **TestPages**
   - Dashboard: See role-specific view
   - Products: Manage product list
   - Categories: Organize products
   - Stock In/Out: Record inventory movement
   - Reports: View analytics

---

## Project Structure

```
src/
├── app/
│   ├── components/        # Reusable components
│   ├── context/          # Auth & state management
│   ├── pages/            # 15+ page components
│   └── styles/           # Design system
├── main.tsx              # Entry point
└── App.tsx               # Main component
```

---

## Common Commands

### Development

```bash
# Start dev server (http://localhost:5173)
pnpm dev

# Hot reload is automatic
```

### Production

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Check for TypeScript errors
pnpm tsc --noEmit
```

### Code Quality

```bash
# Format code (if Prettier configured)
pnpm format

# Lint code (if ESLint configured)
pnpm lint
```

---

## Key Features to Try

### 1. Role-Based Dashboards
- **Admin:** Full dashboard with all charts
- **Staff:** Simple dashboard with quick actions
- **Manager:** Analytics-focused dashboard

### 2. Data Tables
- Click column headers to sort
- Use search bar to filter
- Click rows to select

### 3. Forms
- Try "Add Product" button
- Try "Stock In" form
- Try "Add Category" modal

### 4. Charts
- View bar charts in dashboard
- View pie charts in reports
- Interactive tooltips

### 5. Navigation
- Sidebar changes based on role
- Breadcrumb or header navigation
- Active route highlighting

---

## File Organization Guide

### Adding a New Page

1. Create component in `src/app/pages/NewPage.tsx`
2. Add route to `src/app/routes.ts`
3. Add menu item to `Sidebar.tsx`
4. Set role restrictions in `Sidebar.tsx`

Example:
```tsx
// src/app/pages/NewPage.tsx
export default function NewPage() {
  return <div>My Page</div>;
}

// Add to routes.ts
{ path: "new-page", Component: NewPage }

// Add to Sidebar.tsx menuItems
{ path: '/new-page', label: 'New Page', icon: Icon, roles: ['admin'] }
```

### Customizing Colors

1. Edit `src/app/styles/designSystem.ts`
2. Update `colors` object
3. Rebuild with `pnpm dev`

Example:
```tsx
export const colors = {
  primary: '#3B82F6',  // Change blue to your color
  // ...
};
```

### Adding a Table

```tsx
import DataTable from '../components/DataTable';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', render: (v) => <Badge>{v}</Badge> },
];

<DataTable columns={columns} data={data} />
```

---

## Troubleshooting

### "pnpm: command not found"
```bash
npm install -g pnpm
```

### "Port 5173 already in use"
```bash
# Vite will use different port automatically
# Or kill process: lsof -ti:5173 | xargs kill -9
```

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### "Styles not applying"
- Check Tailwind CSS config
- Verify class names are correct
- Clear browser cache (Ctrl+Shift+Del)

### "Components not rendering"
- Check React version compatibility
- Verify import paths
- Check console for errors (F12)

---

## Documentation

### Read More

- **[DESIGN_DOCUMENTATION.md](./DESIGN_DOCUMENTATION.md)** - Design system, colors, typography
- **[COMPONENT_USAGE_GUIDE.md](./COMPONENT_USAGE_GUIDE.md)** - Component API, examples
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Project features, structure
- **[guidelines/Guidelines.md](./guidelines/Guidelines.md)** - General guidelines

### External Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [Lucide Icons](https://lucide.dev)

---

## Development Tips

### 1. **Use TypeScript**
- Full intellisense in editor
- Catch errors early
- Better code documentation

### 2. **Component Reusability**
- Create small, focused components
- Pass props instead of hardcoding
- Use composition over inheritance

### 3. **Performance**
- Use React.memo for expensive components
- Lazy load route components
- Optimize images and assets

### 4. **State Management**
- Use Context API for global state
- Keep local state in component
- Avoid prop drilling

### 5. **Testing**
```bash
# Component snapshot testing
# End-to-end testing with Playwright
# Unit testing with Vitest
```

---

## Deployment

### Prepare for Production

```bash
# 1. Build the project
pnpm build

# 2. Check build output
ls -la dist/

# 3. Test production build locally
pnpm preview
```

### Deploy to Hosting

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
- Connect GitHub repo
- Set build command: `pnpm build`
- Set publish directory: `dist`

**Traditional Server:**
```bash
# Copy dist folder to your server
scp -r dist/* user@server.com:/var/www/html/
```

---

## Getting Help

### Debug Mode

```bash
# Check for TypeScript errors
pnpm tsc --noEmit

# Check console in browser (F12)
# Check Network tab for API calls
# Check Storage tab for local data
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Blank page | Check console (F12) for errors |
| Styles missing | Rebuilding usually fixes it |
| Roles not showing | Check AuthContext provider |
| Search not working | Check DataTable imports |
| Charts not rendering | Check Recharts installation |

---

## Next Steps

1. ✅ Install and run project
2. ✅ Explore existing pages
3. ✅ Try role switching
4. ✅ Customize colors/theme
5. ✅ Add your own pages
6. ✅ Connect to backend API
7. ✅ Deploy to production

---

## Support

- 📖 Read the documentation files
- 🔍 Check component examples
- 💬 Review code comments
- 🐛 Check console for errors
- 🌐 Check external docs

---

## Happy Coding! 🎉

You're all set to start building amazing inventory management interfaces!

**Questions?** Check the documentation files or review the component examples.
