import {
  LayoutDashboard,
  Package,
  FolderTree,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  BarChart3,
  Users,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useState } from 'react';

interface MenuItem {
  path: string;
  label: string;
  icon: any;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff', 'manager'] },
  { path: '/products', label: 'Products', icon: Package, roles: ['admin', 'staff'] },
  { path: '/categories', label: 'Categories', icon: FolderTree, roles: ['admin'] },
  { path: '/users', label: 'Users', icon: Users, roles: ['admin'] },
  { path: '/stock-in', label: 'Stock In', icon: ArrowDownToLine, roles: ['staff', 'admin'] },
  { path: '/stock-out', label: 'Stock Out', icon: ArrowUpFromLine, roles: ['staff', 'admin'] },
  { path: '/transactions', label: 'Transactions', icon: History, roles: ['admin', 'staff', 'manager'] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'manager'] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, setRole } = useAuth();
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);

  const visibleItems = menuItems.filter((item) => item.roles.includes(user?.role || 'admin'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-600';
      case 'staff':
        return 'bg-green-600';
      case 'manager':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl border-r border-slate-700">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            IMS
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Inventory</h1>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </div>
      </div>

      {/* Current User & Role */}
      <div className="px-4 py-4 border-b border-slate-700 mx-2 rounded-lg bg-slate-800">
        <p className="text-xs text-slate-400 mb-2">Current User</p>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase text-white mt-1 ${getRoleBadgeColor(user?.role || 'admin')}`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Role Switcher (Demo) */}
      {/* <div className="p-4 border-t border-slate-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-xs font-semibold transition-colors">
              <span>Switch Role</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                setRole('admin');
                setIsRoleSwitching(!isRoleSwitching);
              }}
              className="cursor-pointer gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
              Admin - Full Control
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setRole('staff');
                setIsRoleSwitching(!isRoleSwitching);
              }}
              className="cursor-pointer gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-600 mr-2" />
              Staff - Operations
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setRole('manager');
                setIsRoleSwitching(!isRoleSwitching);
              }}
              className="cursor-pointer gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-purple-600 mr-2" />
              Manager - Analytics
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
