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
import { categoryAPI } from '../../api/api';
import useSWR from 'swr';
import { fetcher } from '../../api/fetcher';

interface Category {
  id: number;
  name: string;
  description?: string;
  productCount?: number;
}

export default function Categories() {
  const { data, error, isLoading, mutate } = useSWR(
    "http://127.0.0.1:8000/api/categories",
    fetcher
  );

  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      const cats = Array.isArray(data) ? data : data?.data || [];
      setCategories(cats);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
      };

      if (editingId) {
        await categoryAPI.update(editingId, payload);
      } else {
        await categoryAPI.create(payload);
      }

      setFormData({ name: "", description: "" });
      setEditingId(null);
      setIsOpen(false);
      mutate();
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await categoryAPI.delete(id);
      mutate();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category");
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setEditingId(category.id);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen && !editingId) {
      setFormData({ name: "", description: "" });
    }
  }, [isOpen, editingId]);
  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Category Management</h1>
          <p className="text-slate-600 mt-2">Organize your products by categories.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription>
                {editingId ? "Update the category details." : "Create a new product category."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <Label>Category Name</Label>
                <Input
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {editingId ? "Update Category" : "Add Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <DataTable
          columns={[
            { key: 'name', label: 'Category Name', sortable: true },
            { key: 'description', label: 'Description', sortable: true },
            {
              key: 'actions',
              label: 'Actions',
              render: (_, row: Category) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(row)}
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
          data={categories}
          searchPlaceholder="Search categories..."
        />
      </div>
    </div>
  );
}
