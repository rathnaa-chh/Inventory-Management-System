import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import DataTable from '../components/DataTable';
import { useState } from 'react';
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

const categoryData = [
  { id: 1, name: 'Electronics', productCount: 450, description: 'Computers and accessories' },
  { id: 2, name: 'Apparel', productCount: 280, description: 'Clothing and fashion' },
  { id: 3, name: 'Food', productCount: 320, description: 'Food and beverages' },
  { id: 4, name: 'Books', productCount: 180, description: 'Books and media' },
];

export default function Categories() {
  const [isOpen, setIsOpen] = useState(false);
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
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product category.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Category Name</Label>
                <Input placeholder="Enter category name" className="mt-2" />
              </div>
              <div>
                <Label>Description</Label>
                <Input placeholder="Enter description" className="mt-2" />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <DataTable
          columns={[
            { key: 'name', label: 'Category Name', sortable: true },
            { key: 'description', label: 'Description', sortable: true },
            { key: 'productCount', label: 'Products', sortable: true },
            {
              key: 'actions',
              label: 'Actions',
              render: () => (
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ),
            },
          ]}
          data={categoryData}
          searchPlaceholder="Search categories..."
        />
      </div>
    </div>
  );
}
