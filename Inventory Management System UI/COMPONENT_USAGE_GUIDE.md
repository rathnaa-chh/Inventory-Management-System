# Component Usage Guide

## Overview

This guide explains how to use each component in the Inventory Management System UI.

---

## Context & Authentication

### AuthContext

**Purpose:** Manages user authentication and role-based access

**Usage:**
```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout, setRole } = useAuth();
  
  // Access current user
  console.log(user?.name); // Admin user
  console.log(user?.role); // 'admin' | 'staff' | 'manager'
  
  // Change role (for demo)
  const handleRoleChange = () => {
    setRole('staff');
  };
  
  return <div>Current Role: {user?.role}</div>;
}
```

**Available Methods:**
- `user`: Current user object (id, name, email, role, avatar)
- `isAuthenticated`: Boolean for authentication status
- `login(user)`: Set logged in user
- `logout()`: Clear user session
- `setRole(role)`: Switch user role (demo feature)

---

## Layout Components

### DashboardLayout

**Purpose:** Main layout wrapper with sidebar, header, and content area

**Location:** `src/app/components/DashboardLayout.tsx`

**Features:**
- Provides AuthProvider context
- Renders Sidebar component
- Renders Header component
- Outlets child routes

**No props required** - Automatically wraps all authenticated routes

### Sidebar

**Location:** `src/app/components/Sidebar.tsx`

**Features:**
- Role-based navigation menu
- Current user display
- Role switcher (demo)
- Logout button

**Menu Visibility:**
```
Admin:   Dashboard, Products, Categories, Users, Stock In/Out, Transactions, Reports
Staff:   Dashboard, Products, Stock In/Out, Transactions
Manager: Dashboard, Transactions, Reports
```

### Header

**Location:** `src/app/components/Header.tsx`

**Features:**
- Search bar (integrated)
- Notification bell
- User profile dropdown
- Settings access

**Props:** None (uses AuthContext internally)

---

## Data Display Components

### StatCard

**Location:** `src/app/components/StatCard.tsx`

**Purpose:** Display KPI metrics with trend indicators

**Usage:**
```tsx
import StatCard from '../components/StatCard';
import { Package } from 'lucide-react';

<StatCard
  title="Total Products"
  value="1,428"
  icon={Package}
  trend={12}
  trendLabel="vs last month"
/>
```

**Props:**
```tsx
interface StatCardProps {
  title: string;           // Card title
  value: string | number;  // Main value display
  icon: LucideIcon;        // Icon component
  trend?: number;          // Percentage change (positive/negative)
  trendLabel?: string;     // Label for trend
  className?: string;      // Additional CSS classes
}
```

### DataTable

**Location:** `src/app/components/DataTable.tsx`

**Purpose:** Display, sort, and search tabular data

**Usage:**
```tsx
import DataTable from '../components/DataTable';

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`badge ${value === 'active' ? 'bg-green' : 'bg-red'}`}>
        {value}
      </span>
    ),
  },
];

const data = [
  { id: 1, status: 'active' },
  { id: 2, status: 'inactive' },
];

<DataTable
  columns={columns}
  data={data}
  searchPlaceholder="Search items..."
  onRowClick={(row) => console.log(row)}
/>
```

**Props:**
```tsx
interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}
```

**Features:**
- Sortable columns (click header)
- Full-text search
- Custom cell rendering
- Click handlers
- No data state

---

## Page Components

### Dashboard

**Location:** `src/app/pages/Dashboard.tsx`

**Purpose:** Role-based dashboard router

**Behavior:**
- Admin role → AdminDashboard
- Staff role → StaffDashboard
- Manager role → ManagerDashboard

**No props required**

### AdminDashboard

**Display:**
- 4 stat cards (Products, Categories, Low Stock, Transactions)
- Stock movement bar chart
- Category distribution pie chart
- Recent transactions table
- Trends and metrics

### StaffDashboard

**Display:**
- 2 stat cards (Products, Low Stock)
- Quick action buttons (Stock In/Out)
- Current inventory table

### ManagerDashboard

**Display:**
- 4 stat cards
- Stock movement trend analysis
- Category distribution
- Product overview table

### Products

**Location:** `src/app/pages/Products.tsx`

**Features:**
- Add product modal
- Sortable, searchable table
- Edit/Delete actions
- Status badges

**Table Columns:**
- Product Name
- Category
- Price ($)
- Quantity
- Status
- Actions

### Categories

**Location:** `src/app/pages/Categories.tsx`

**Features:**
- Add category modal
- Category management
- Product count display
- Edit/Delete actions

### Users

**Location:** `src/app/pages/Users.tsx`

**Features:**
- Admin-only access
- Add user modal
- User management table
- Role assignment
- Edit/Delete actions

**Roles:**
- Admin: Full control
- Staff: Stock operations
- Manager: Analytics access

### StockIn

**Location:** `src/app/pages/StockIn.tsx`

**Features:**
- Product dropdown
- Quantity input
- Date selection
- Notes field
- Recent entries display

### StockOut

**Location:** `src/app/pages/StockOut.tsx`

**Features:**
- Product dropdown
- Quantity input
- Reason selection (Sale/Return/Damage/Other)
- Date selection
- Notes field
- Recent entries display

### TransactionHistory

**Location:** `src/app/pages/TransactionHistory.tsx`

**Features:**
- Complete transaction log
- Searchable table
- Type badges (IN/OUT)
- User tracking
- Date filtering

### Reports

**Location:** `src/app/pages/Reports.tsx`

**Features:**
- Stock movement trends chart
- Category distribution pie chart
- Key metrics display
- Top moving products ranking
- Export/Print buttons

### Profile

**Location:** `src/app/pages/Profile.tsx`

**Features:**
- Personal information editing
- Password change
- Profile picture display
- Account status
- Login history

---

## Form Components (shadcn/ui)

### Input

```tsx
import { Input } from '../components/ui/input';

<Input
  type="text"
  placeholder="Enter text"
  className="mt-2"
/>

<Input
  type="number"
  placeholder="Enter quantity"
  min="1"
/>

<Input
  type="email"
  placeholder="Enter email"
/>

<Input
  type="date"
/>

<Input
  type="password"
  placeholder="Enter password"
/>
```

### Label

```tsx
import { Label } from '../components/ui/label';

<Label className="text-sm font-semibold">Product Name</Label>
```

### Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Button

```tsx
import { Button } from '../components/ui/button';

// Primary button
<Button className="bg-blue-600 hover:bg-blue-700">
  Submit
</Button>

// Outline button
<Button variant="outline">
  Cancel
</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Dialog (Modal)

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>
        Modal description
      </DialogDescription>
    </DialogHeader>
    {/* Modal content */}
  </DialogContent>
</Dialog>
```

### DropdownMenu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem className="cursor-pointer">
      Option 1
    </DropdownMenuItem>
    <DropdownMenuItem className="cursor-pointer">
      Option 2
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Chart Components (Recharts)

### Bar Chart

```tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', stockIn: 2400, stockOut: 1600 },
  { month: 'Feb', stockIn: 1800, stockOut: 1500 },
];

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="stockIn" fill="#3B82F6" />
    <Bar dataKey="stockOut" fill="#10B981" />
  </BarChart>
</ResponsiveContainer>
```

### Pie Chart

```tsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Electronics', value: 35, color: '#3B82F6' },
  { name: 'Apparel', value: 25, color: '#10B981' },
];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      outerRadius={100}
      dataKey="value"
      label
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

---

## Icons (Lucide React)

```tsx
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  BarChart3,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Search,
} from 'lucide-react';

// Use in JSX
<Package className="w-5 h-5 text-blue-600" />
<Edit className="w-4 h-4" />
```

---

## Common Patterns

### Creating a Status Badge

```tsx
const statusBadge = (status: string) => {
  let bgColor = 'bg-green-100 text-green-700';
  if (status === 'Low Stock') bgColor = 'bg-yellow-100 text-yellow-700';
  if (status === 'Out of Stock') bgColor = 'bg-red-100 text-red-700';
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bgColor}`}>
      {status}
    </span>
  );
};
```

### Role-Based Rendering

```tsx
import { useAuth } from '../context/AuthContext';

function FeatureComponent() {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <AdminFeature />;
  }
  
  if (user?.role === 'manager') {
    return <ManagerFeature />;
  }
  
  return <StaffFeature />;
}
```

### Table with Custom Rendering

```tsx
const columns = [
  {
    key: 'price',
    label: 'Price',
    render: (value) => `$${value.toFixed(2)}`,
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => statusBadge(value),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: () => (
      <div className="flex gap-2">
        <button onClick={() => editItem()}>
          <Edit className="w-4 h-4 text-blue-600" />
        </button>
        <button onClick={() => deleteItem()}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    ),
  },
];
```

---

## Styling Guidelines

### Tailwind Classes Architecture

**Layout:**
```tsx
<div className="p-8 space-y-6">
  {/* p-8 = padding, space-y-6 = vertical spacing */}
</div>
```

**Cards:**
```tsx
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
  {/* bg-white, rounded corners, soft shadow, gray border */}
</div>
```

**Buttons:**
```tsx
// Primary
<button className="bg-blue-600 hover:bg-blue-700">Primary</button>

// Secondary
<button className="border border-slate-200 hover:bg-slate-100">Secondary</button>
```

**Text Colors:**
```tsx
// Headings
<h1 className="text-3xl font-bold text-slate-900">Page Title</h1>

// Description
<p className="text-slate-600 mt-2">Description text</p>

// Muted
<p className="text-slate-500 text-sm">Muted text</p>
```

---

## Performance Tips

1. **Use DataTable for large datasets** - Handles sorting and filtering efficiently
2. **Lazy load charts** - Consider React.lazy for reports page
3. **Memoize callbacks** - Use useCallback in table row handlers
4. **Debounce search** - DataTable handles this internally
5. **Optimize re-renders** - Use AuthContext selector pattern if needed

---

## Troubleshooting

### Modal not closing
- Ensure Dialog state is managed correctly
- Check if DialogTrigger is properly linked

### Styles not applying
- Check Tailwind CSS configuration
- Verify class names are correct
- Clear build cache: `pnpm build --force`

### Table not sorting
- Ensure column has `sortable: true`
- Check data key matches column key

### AuthContext not available
- Wrap component in AuthProvider
- Check DashboardLayout wraps routes

---

## Additional Resources

- [Tailwind CSS Docs](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org)
- [Lucide Icons](https://lucide.dev)
- [React Router Documentation](https://reactrouter.com)

---

## Version Information

- React: 18+
- TypeScript: Latest
- Tailwind CSS: Latest
- shadcn/ui: Latest
- Recharts: Latest
- Lucide React: Latest
