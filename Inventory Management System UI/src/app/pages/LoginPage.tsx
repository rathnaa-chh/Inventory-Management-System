import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, AlertCircle } from 'lucide-react';
import { authService } from '../../api/services';
import { useAuth } from '../context/AuthContext';
import { useNotificationService } from '../services/notificationService';

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { notifyAuthSuccess, notifyAuthError } = useNotificationService();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const [loginData, setLoginData] = useState({
    email: 'admin@inventory.com',
    password: 'password123',
  });

  // =========================
  // VALIDATION HELPERS
  // =========================
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!loginData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!loginData.password.trim()) {
      errors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // =========================
  // LOGIN HANDLER
  // =========================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateLoginForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(loginData.email, loginData.password);
      
      authService.setAuthToken(response.token);
      
      login({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role || 'staff',
      });
      
      notifyAuthSuccess(`Welcome back, ${response.user.name}!`);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      notifyAuthError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Inventory Management System</h1>
            <p className="text-blue-100">Manage your inventory with ease</p>
          </div>

          {/* CONTENT */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => {
                    setLoginData({ ...loginData, email: e.target.value });
                    if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-smooth ${
                    validationErrors.email
                      ? 'border-red-300 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
                {validationErrors.email && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value });
                    if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-smooth ${
                    validationErrors.password
                      ? 'border-red-300 focus:ring-red-600'
                      : 'border-gray-300 focus:ring-blue-600'
                  }`}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                {validationErrors.password && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full btn-smooth bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
