import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, FolderTree, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useEffect, useState } from 'react';
import { productService, categoryService, transactionService } from '../../api/services';
import { useNotificationService } from '../services/notificationService';

interface ChartDataPoint {
  month: string;
  stockIn: number;
  stockOut: number;
}

interface Product {
  id: number;
  name: string;
  quantity: number;
  status: string;
}

export default function ManagerDashboard() {
  const { notifyDataLoadError } = useNotificationService();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockCount: 0,
    totalTransactions: 0,
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch products
        const productsRes = await productService.getAll();
        const productList = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];

        // Fetch categories
        const categoriesRes = await categoryService.getAll();
        const categories = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes?.data || [];

        // Fetch transactions
        const transactionsRes = await transactionService.getAll();
        const transactions = Array.isArray(transactionsRes) ? transactionsRes : transactionsRes?.data || [];

        // Calculate stats
        const lowStockCount = productList.filter((p: any) => p.quantity < 10).length;

        // Format products
        const formattedProducts: Product[] = productList.slice(0, 3).map((p: any) => ({
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          status: p.quantity === 0 ? 'Out of Stock' : p.quantity < 10 ? 'Low Stock' : 'In Stock',
        }));

        // Calculate monthly data
        const monthlyData: Record<string, { in: number; out: number }> = {};
        
        transactions.forEach((t: any) => {
          const date = new Date(t.created_at);
          const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { in: 0, out: 0 };
          }
          
          if (t.type === 'IN') {
            monthlyData[monthKey].in += t.quantity;
          } else {
            monthlyData[monthKey].out += t.quantity;
          }
        });

        const chartDataPoints: ChartDataPoint[] = Object.entries(monthlyData)
          .map(([month, data]) => ({
            month,
            stockIn: data.in,
            stockOut: data.out,
          }))
          .slice(-6);

        // Calculate category distribution
        const categoryCount: Record<string, number> = {};
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];
        
        productList.forEach((p: any) => {
          const catName = p.category?.name || 'Other';
          categoryCount[catName] = (categoryCount[catName] || 0) + 1;
        });

        const categoryDataList: any[] = Object.entries(categoryCount).map((entry, index) => ({
          name: entry[0],
          value: entry[1],
          color: colors[index % colors.length],
        }));

        setStats({
          totalProducts: productList.length,
          totalCategories: categories.length,
          lowStockCount,
          totalTransactions: transactions.length,
        });

        setChartData(chartDataPoints.length > 0 ? chartDataPoints : []);
        setCategoryData(categoryDataList);
        setProducts(formattedProducts);
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
        <h1 className="text-3xl font-bold text-slate-900">Manager Dashboard</h1>
        <p className="text-slate-600 mt-2">Analytics and insights for inventory management.</p>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          trend={12}
          trendLabel="vs last month"
        />
        <StatCard
          title="Total Categories"
          value={stats.totalCategories.toLocaleString()}
          icon={FolderTree}
          trend={0}
          trendLabel="No change"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockCount.toLocaleString()}
          icon={AlertTriangle}
          trend={-8}
          trendLabel="vs last month"
        />
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions.toLocaleString()}
          icon={TrendingUp}
          trend={25}
          trendLabel="vs last month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock In vs Out Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Stock Movement Analysis</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0' }} />
                <Legend />
                <Bar dataKey="stockIn" fill="#3B82F6" name="Stock In" radius={[8, 8, 0, 0]} />
                <Bar dataKey="stockOut" fill="#10B981" name="Stock Out" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Category Distribution</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No categories
            </div>
          )}
        </div>
      </div>

      {/* Product Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Product Stock Levels</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

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

