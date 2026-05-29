import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-600 mt-2">Manage your account information.</p>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-semibold">First Name</Label>
                <Input placeholder="First name" defaultValue="Admin" className="mt-2" />
              </div>
              <div>
                <Label className="text-sm font-semibold">Last Name</Label>
                <Input placeholder="Last name" defaultValue="User" className="mt-2" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold">Email</Label>
              <Input
                type="email"
                placeholder="Email"
                defaultValue={user?.email}
                disabled
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold">Role</Label>
              <Input
                placeholder="Role"
                defaultValue={user?.role?.toUpperCase()}
                disabled
                className="mt-2"
              />
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="font-semibold text-slate-900 mb-4">Change Password</h4>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">Current Password</Label>
                  <Input type="password" placeholder="Enter current password" className="mt-2" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">New Password</Label>
                  <Input type="password" placeholder="Enter new password" className="mt-2" />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Confirm Password</Label>
                  <Input type="password" placeholder="Confirm new password" className="mt-2" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
          </div>
        </div>

        {/* Avatar & Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Profile Picture</h3>
            <div className="flex flex-col items-center">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-32 h-32 rounded-full mb-4 border-4 border-slate-200"
              />
              <Button variant="outline" size="sm" className="mb-2">
                Change Photo
              </Button>
              <p className="text-xs text-slate-500 text-center">
                Recommended size: 200x200px
              </p>
            </div>
          </div>

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
                <span className="text-slate-600 text-sm">Member Since</span>
                <span className="text-slate-900 font-medium text-sm">Jan 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Last Login</span>
                <span className="text-slate-900 font-medium text-sm">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
