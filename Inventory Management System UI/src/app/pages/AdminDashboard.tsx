import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, FolderTree, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useState, useEffect } from 'react';
import { productService, categoryService, transactionService } from '../../api/services';
import { useNotificationService } from '../services/notificationService';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockCount: number;
  totalTransactions: number;
}

interface ChartDataPoint {
  month: string;
  stockIn: number;
  stockOut: number;
}

export default function AdminDashboard() {
  const { notifyDataLoadError, notifyLowStock } = useNotificationService();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    lowStockCount: 0,
    totalTransactions: 0,
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch products
        const productsRes = await productService.getAll();
        const products = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];
        
        // Fetch categories
        const categoriesRes = await categoryService.getAll();
        const categories = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes?.data || [];

        // Fetch low stock products
        const lowStockRes = await transactionService.getLowStock(10);
        const lowStockCount = lowStockRes?.count || 0;

        // Fetch transactions summary
        const summaryRes = await transactionService.getSummary();
        const totalTransactions = summaryRes?.transaction_count || 0;

        // Fetch recent transactions
        const transactionsRes = await transactionService.getAll({ limit: 5 });
        const transactions = Array.isArray(transactionsRes) ? transactionsRes.slice(0, 5) : (transactionsRes?.data || []).slice(0, 5);
        const formattedTransactions = transactions.map((t: any) => ({
          id: t.id,
          product: t.product?.name || 'Unknown',
          type: t.type,
          quantity: t.quantity,
          date: new Date(t.created_at).toLocaleDateString(),
          user: t.user?.name || 'Unknown',
        }));

        // Calculate category distribution from products
        const categoryCount: Record<string, number> = {};
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];
        
        products.forEach((p: any) => {
          const catName = p.category?.name || 'Other';
          categoryCount[catName] = (categoryCount[catName] || 0) + 1;
        });

        const categoryData = Object.entries(categoryCount).map((entry, index) => ({
          name: entry[0],
          value: (entry[1] as number),
          color: colors[index % colors.length],
        }));

        // Generate monthly chart data from transactions
        const monthlyData: Record<string, { in: number; out: number }> = {};
        
        if (Array.isArray(transactionsRes) || transactionsRes?.data) {
          const allTransactions = Array.isArray(transactionsRes) ? transactionsRes : transactionsRes?.data || [];
          allTransactions.forEach((t: any) => {
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
        }

        const chartDataPoints: ChartDataPoint[] = Object.entries(monthlyData)
          .map(([month, data]) => ({
            month,
            stockIn: data.in,
            stockOut: data.out,
          }))
          .slice(-6); // Last 6 months

        // If no data, generate sample data
        if (chartDataPoints.length === 0) {
          chartDataPoints.push(
            { month: 'Jan', stockIn: 0, stockOut: 0 },
            { month: 'Feb', stockIn: 0, stockOut: 0 },
            { month: 'Mar', stockIn: 0, stockOut: 0 },
            { month: 'Apr', stockIn: 0, stockOut: 0 },
            { month: 'May', stockIn: 0, stockOut: 0 },
            { month: 'Jun', stockIn: 0, stockOut: 0 }
          );
        }

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          lowStockCount,
          totalTransactions,
        });

        setChartData(chartDataPoints);
        setCategoryDistribution(categoryData);
        setRecentTransactions(formattedTransactions);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        notifyDataLoadError('dashboard');
        
        // Set default empty states
        setRecentTransactions([]);
        setCategoryDistribution([]);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here's your business overview.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

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
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Stock Movement</h3>
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
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Products by Category</h3>
          {categoryDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
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

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        {recentTransactions.length > 0 ? (
          <DataTable
            columns={[
              { key: 'product', label: 'Product', sortable: true },
              {
                key: 'type',
                label: 'Type',
                render: (value) => (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      value === 'IN'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {value}
                  </span>
                ),
              },
              { key: 'quantity', label: 'Quantity', sortable: true },
              { key: 'date', label: 'Date', sortable: true },
              { key: 'user', label: 'User', sortable: true },
            ]}
            data={recentTransactions}
            searchPlaceholder="Search transactions..."
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}
