import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationContainer from './components/NotificationContainer';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NotificationContainer />
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  );
}