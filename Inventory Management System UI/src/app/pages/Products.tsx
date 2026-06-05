import { Plus } from 'lucide-react';
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
import { productAPI, categoryAPI } from '../../api/api';
import useSWR from 'swr';
import { fetcher } from '../../api/fetcher';

interface Product {
  id: number;
  name: string;
  category_id: number;
  price: number;
  quantity: number;
}

export default function Products() {
  const { data, error, isLoading, mutate } = useSWR(
    "http://127.0.0.1:8000/api/products",
    fetcher
  );

  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    quantity: "",
  });

  // =========================
  // LOAD CATEGORIES
  // =========================
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        const cats = Array.isArray(res) ? res : res?.data || [];
        console.log("Categories loaded:", cats);
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    loadCategories();
  }, []);

  // =========================
  // RESET FORM WHEN DIALOG OPENS
  // =========================
  useEffect(() => {
    if (!isOpen && !editingId) {
      setFormData({
        name: "",
        category_id: "",
        price: "",
        quantity: "",
      });
    }
  }, [isOpen, editingId]);

  // =========================
  // HELPERS
  // =========================
  const getCategoryName = (id: number) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Unknown";
  };

  const getStatus = (quantity: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity < 10) return "Low Stock";
    return "In Stock";
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category_id) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        category_id: Number(formData.category_id),
        price: formData.price ? parseFloat(formData.price) : 0,
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      };

      if (editingId) {
        await productAPI.update(editingId, payload);
        alert("Product updated successfully!");
      } else {
        await productAPI.create(payload);
        alert("Product created successfully!");
      }

      setFormData({
        name: "",
        category_id: "",
        price: "",
        quantity: "",
      });

      setEditingId(null);
      setIsOpen(false);
      mutate();

    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product");
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await productAPI.delete(id);
      mutate();
      alert("Product deleted successfully!");
    } catch {
      alert("Delete failed");
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category_id: product.category_id.toString(),
      price: product.price.toString(),
      quantity: product.quantity.toString(),
    });

    setEditingId(product.id);
    setIsOpen(true);
  };

  return (
    <div className="p-8 space-y-6">

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Products</h1>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Product" : "Add Product"}
              </DialogTitle>
              <DialogDescription>
                Fill product information
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Category</Label>
                <select
                  className="w-full border p-2 rounded bg-white"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">-- Select a category --</option>
                  {categories && categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories available</option>
                  )}
                </select>
              </div>

              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                {editingId ? "Update Product" : "Add Product"}
              </Button>

            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <div className="text-red-500">Failed to load products</div>}

      <div className="bg-white p-6 rounded shadow">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <DataTable
            data={data?.data || data || []}
            columns={[
              { key: "name", label: "Product Name" },

              {
                key: "category_id",
                label: "Category",
                render: (value) => getCategoryName(value)
              },

              {
                key: "price",
                label: "Price",
                render: (value) => `$${parseFloat(value).toFixed(2)}`
              },

              { key: "quantity", label: "Quantity" },

              {
                key: "status",
                label: "Status",
                render: (value) => {
                  const status = getStatus(value);

                  let color = "bg-green-100 text-green-700";
                  if (status === "Low Stock")
                    color = "bg-yellow-100 text-yellow-700";
                  if (status === "Out of Stock")
                    color = "bg-red-100 text-red-700";

                  return (
                    <span className={`px-2 py-1 rounded text-xs ${color}`}>
                      {status}
                    </span>
                  );
                }
              },

              {
                key: "actions",
                label: "Actions",
                render: (_, row) => (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(row.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )
              }
            ]}
          />
        )}
      </div>
    </div>
  );
}