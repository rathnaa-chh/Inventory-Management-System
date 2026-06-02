import { Search, Bell, User as UserIcon, LogOut, Lock, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import { Input } from '../components/ui/input';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Navigate to search results or trigger global search
      console.log('Searching for:', searchTerm);
      // You can implement search results page here
      setSearchTerm('');
    }
  };

  const handleProfileSettings = () => {
    navigate('/profile');
  };

  const handleChangePassword = () => {
    navigate('/profile');
  };

  const handlePreferences = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search products, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-10 pr-4 py-2 rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Notifications">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors">
                <img
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User')}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500">{user?.email || 'email@example.com'}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={handleProfileSettings}
                className="cursor-pointer gap-2 px-4 py-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleChangePassword}
                className="cursor-pointer gap-2 px-4 py-2"
              >
                <Lock className="w-4 h-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handlePreferences}
                className="cursor-pointer gap-2 px-4 py-2"
              >
                <Settings className="w-4 h-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer gap-2 px-4 py-2 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
