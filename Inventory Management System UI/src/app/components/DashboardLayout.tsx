import { Outlet, Navigate } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';
import SmoothLoader from './SmoothLoader';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <SmoothLoader message="Loading dashboard..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
