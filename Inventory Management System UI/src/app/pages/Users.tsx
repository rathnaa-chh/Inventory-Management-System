import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import DataTable from '../components/DataTable';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { userService } from '../../api/services';
import { useNotification } from '../context/NotificationContext';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'Active' | 'Inactive';
  created_at: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'staff';
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'staff',
  });
  const { addNotification } = useNotification();

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load users',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'staff',
    });
    setEditingId(null);
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      resetForm();
    }
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update user
        const payload: Record<string, any> = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          payload.password = formData.password;
        }
        await userService.update(editingId, payload);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'User updated successfully',
        });
      } else {
        // Create new user
        await userService.create(formData);
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'User created successfully',
        });
      }
      handleCloseDialog();
      loadUsers();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to save user',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.delete(id);
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'User deleted successfully',
      });
      loadUsers();
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to delete user',
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-slate-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-2">Manage system users and their roles.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700 gap-2"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {editingId
                  ? 'Update user information and permissions.'
                  : 'Create a new user account with selected role.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label>Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Password {editingId ? '' : '*'}</Label>
                <Input
                  type="password"
                  placeholder={editingId ? 'Leave empty to keep current password' : 'Set password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-2"
                  required={!editingId}
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {editingId ? 'Update User' : 'Add User'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <DataTable
          columns={[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            {
              key: 'role',
              label: 'Role',
              render: (value) => {
                let bgColor = 'bg-blue-100 text-blue-700';
                if (value === 'staff') bgColor = 'bg-green-100 text-green-700';
                if (value === 'manager') bgColor = 'bg-purple-100 text-purple-700';
                return (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${bgColor}`}>
                    {value}
                  </span>
                );
              },
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    value === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {value}
                </span>
              ),
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row: any) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenDialog(row)}
                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ),
            },
          ]}
          data={users}
          searchPlaceholder="Search users..."
        />
      </div>
    </div>
  );
}
