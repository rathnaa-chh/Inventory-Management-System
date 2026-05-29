import { Package, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useEffect, useState } from 'react';
import { productService, transactionService } from '../../api/services';
import { useNavigate } from 'react-router';
import { useNotificationService } from '../services/notificationService';

interface Product {
  id: number;
  name: string;
  quantity: number;
  status: string;
  price?: number;
}

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { notifyDataLoadError } = useNotificationService();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all products
        const productsRes = await productService.getAll();
        const productList = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];

        // Calculate low stock count
        const lowStockCount = productList.filter((p: any) => p.quantity < 10).length;

        // Format products with status
        const formattedProducts: Product[] = productList.map((p: any) => ({
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          status: p.quantity === 0 ? 'Out of Stock' : p.quantity < 10 ? 'Low Stock' : 'In Stock',
          price: p.price,
        }));

        setProducts(formattedProducts);
        setStats({
          total: productList.length,
          lowStock: lowStockCount,
        });
      } catch (err) {
        console.error('Error loading dashboard:', err);
        notifyDataLoadError('dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Staff Dashboard</h1>
        <p className="text-slate-600 mt-2">Manage inventory operations efficiently.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Total Products"
          value={stats.total.toLocaleString()}
          icon={Package}
          trend={12}
          trendLabel="vs last month"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStock.toLocaleString()}
          icon={AlertTriangle}
          trend={-8}
          trendLabel="vs last month"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="flex gap-3 flex-wrap">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/stock-in')}
          >
            Stock In
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/stock-out')}
          >
            Stock Out
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/transactions')}
          >
            View Transactions
          </Button>
        </div>
      </div>

      {/* Current Inventory */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Current Inventory</h3>
        {products.length > 0 ? (
          <DataTable
            columns={[
              { key: 'name', label: 'Product Name', sortable: true },
              { key: 'quantity', label: 'Quantity', sortable: true },
              {
                key: 'status',
                label: 'Status',
                render: (value) => {
                  let bgColor = 'bg-green-100 text-green-700';
                  if (value === 'Low Stock') bgColor = 'bg-yellow-100 text-yellow-700';
                  if (value === 'Out of Stock') bgColor = 'bg-red-100 text-red-700';
                  return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bgColor}`}>
                      {value}
                    </span>
                  );
                },
              },
            ]}
            data={products}
            searchPlaceholder="Search products..."
          />
        ) : (
          <div className="text-center py-8 text-slate-500">
            No products available
          </div>
        )}
      </div>
    </div>
  );
}

