import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, AlertCircle } from 'lucide-react';
import { authService } from '../../api/services';
import { useAuth } from '../context/AuthContext';
import { useNotificationService } from '../services/notificationService';

interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
  password_confirmation?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { notifyAuthSuccess, notifyAuthError } = useNotificationService();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Login form
  const [loginData, setLoginData] = useState({
    email: 'admin@inventory.com',
    password: 'password123',
  });

  // Signup form
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'staff',
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

  const validateSignUpForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!signUpData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!signUpData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(signUpData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!signUpData.password.trim()) {
      errors.password = 'Password is required';
    } else if (signUpData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!signUpData.password_confirmation.trim()) {
      errors.password_confirmation = 'Please confirm your password';
    } else if (signUpData.password !== signUpData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
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

  // =========================
  // SIGNUP HANDLER
  // =========================
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateSignUpForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        password_confirmation: signUpData.password_confirmation,
        role: signUpData.role,
      });
      
      authService.setAuthToken(response.token);
      
      login({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role || 'staff',
      });
      
      notifyAuthSuccess(`Welcome, ${response.user.name}! Your account has been created.`);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed. Please try again.';
      setError(errorMessage);
      notifyAuthError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-8">
      <div className="w-full max-w-2xl">
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
            
            {/* TABS */}
            <div className="flex gap-4 mb-8 border-b">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                  setValidationErrors({});
                }}
                className={`px-6 py-3 font-semibold transition-colors ${
                  !isSignUp
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                  setValidationErrors({});
                }}
                className={`px-6 py-3 font-semibold transition-colors ${
                  isSignUp
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {!isSignUp ? (
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
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
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSignUp} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={signUpData.name}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, name: e.target.value });
                      if (validationErrors.name) setValidationErrors({ ...validationErrors, name: undefined });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      validationErrors.name
                        ? 'border-red-300 focus:ring-red-600'
                        : 'border-gray-300 focus:ring-blue-600'
                    }`}
                    placeholder="Enter your name"
                    required
                    disabled={loading}
                  />
                  {validationErrors.name && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, email: e.target.value });
                      if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
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
                    value={signUpData.password}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, password: e.target.value });
                      if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      validationErrors.password
                        ? 'border-red-300 focus:ring-red-600'
                        : 'border-gray-300 focus:ring-blue-600'
                    }`}
                    placeholder="Enter password (min 6 characters)"
                    required
                    disabled={loading}
                  />
                  {validationErrors.password && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={signUpData.password_confirmation}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, password_confirmation: e.target.value });
                      if (validationErrors.password_confirmation) setValidationErrors({ ...validationErrors, password_confirmation: undefined });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      validationErrors.password_confirmation
                        ? 'border-red-300 focus:ring-red-600'
                        : 'border-gray-300 focus:ring-blue-600'
                    }`}
                    placeholder="Confirm password"
                    required
                    disabled={loading}
                  />
                  {validationErrors.password_confirmation && (
                    <p className="text-red-600 text-sm mt-1">{validationErrors.password_confirmation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Role</label>
                  <select
                    value={signUpData.role}
                    onChange={(e) => setSignUpData({ ...signUpData, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={loading}
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}


          </div>
        </div>
      </div>
    </div>
)}
