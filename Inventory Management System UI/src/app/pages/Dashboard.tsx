import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import ManagerDashboard from './ManagerDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'staff':
      return <StaffDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'admin':
    default:
      return <AdminDashboard />;
  }
}
