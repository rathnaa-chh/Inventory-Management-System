import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { authService } from '../../api/services';
import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useNotificationService } from '../services/notificationService';

interface ProfileData {
  name: string;
  email: string;
}

interface PasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { notifyProfileUpdate, notifyAuthSuccess } = useNotificationService();
  
  const [profileData, setProfileData] = useState<ProfileData>({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Load user profile data on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!profileData.name.trim() || !profileData.email.trim()) {
      setErrorMessage('Name and email are required');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.updateProfile({
        name: profileData.name,
        email: profileData.email,
      });

      notifyProfileUpdate(true, 'Your profile has been updated successfully');
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update profile';
      setErrorMessage(errorMsg);
      notifyProfileUpdate(false, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordData.current_password || !passwordData.new_password) {
      setPasswordError('All password fields are required');
      return;
    }

    if (passwordData.new_password.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      await authService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });

      notifyProfileUpdate(true, 'Your password has been changed successfully');
      setPasswordSuccess('Password changed successfully!');
      
      // Reset form
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });

      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to change password';
      setPasswordError(errorMsg);
      notifyProfileUpdate(false, errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-600 mt-2">Manage your account information and preferences.</p>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>

            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <Label className="text-sm font-semibold">Full Name</Label>
                <Input
                  placeholder="Full name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="mt-2"
                  disabled={loading}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold">Email Address</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="mt-2"
                  disabled={loading}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold">Role</Label>
                <Input
                  placeholder="Role"
                  value={user?.role?.toUpperCase() || ''}
                  disabled
                  className="mt-2 bg-slate-50"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" disabled={loading}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>

            {passwordSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Current Password</Label>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  className="mt-2"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  disabled={passwordLoading}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold">New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  className="mt-2"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  disabled={passwordLoading}
                />
              </div>

              <div>
                <Label className="text-sm font-semibold">Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  className="mt-2"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                  disabled={passwordLoading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPasswordData({
                      current_password: '',
                      new_password: '',
                      new_password_confirmation: '',
                    });
                    setPasswordError('');
                  }}
                  disabled={passwordLoading}
                >
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" disabled={passwordLoading}>
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Profile Picture</h3>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full mb-4 border-4 border-slate-200 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-4xl text-white font-bold">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <Button variant="outline" size="sm" className="mb-2" disabled>
                Change Photo (Coming Soon)
              </Button>
              <p className="text-xs text-slate-500 text-center">
                Recommended size: 200x200px
              </p>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Email Verified</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                  Yes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Account Type</span>
                <span className="text-slate-900 font-medium text-sm capitalize">
                  {user?.role || 'User'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
            <Button
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

