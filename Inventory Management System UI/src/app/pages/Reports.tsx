import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';
import { productService, transactionService } from '../../api/services';
import { Download, Printer } from 'lucide-react';
import { useNotificationService } from '../services/notificationService';

interface ChartDataPoint {
  month: string;
  stockIn: number;
  stockOut: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface TopProduct {
  rank: number;
  name: string;
  movement: number;
  trend: string;
}

export default function Reports() {
  const { notifyDataLoadError } = useNotificationService();
  
  const [stockData, setStockData] = useState<ChartDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [metrics, setMetrics] = useState({
    totalStockIn: 0,
    totalStockOut: 0,
    netMovement: 0,
    inventoryValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReportsData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all transactions
        const transactionsRes = await transactionService.getAll();
        const transactions = Array.isArray(transactionsRes) ? transactionsRes : transactionsRes?.data || [];

        // Fetch all products
        const productsRes = await productService.getAll();
        const products = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];

        // Calculate monthly data
        const monthlyData: Record<string, { in: number; out: number }> = {};
        const productMovement: Record<string, number> = {};

        transactions.forEach((t: any) => {
          const date = new Date(t.created_at);
          const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { in: 0, out: 0 };
          }
          
          const productName = t.product?.name || 'Unknown';
          productMovement[productName] = (productMovement[productName] || 0) + t.quantity;
          
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
        
        products.forEach((p: any) => {
          const catName = p.category?.name || 'Other';
          categoryCount[catName] = (categoryCount[catName] || 0) + 1;
        });

        const categoryDataList: CategoryData[] = Object.entries(categoryCount).map((entry, index) => ({
          name: entry[0],
          value: entry[1] as number,
          color: colors[index % colors.length],
        }));

        // Get top products
        const topProductsList: TopProduct[] = Object.entries(productMovement)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([name, movement], index) => ({
            rank: index + 1,
            name,
            movement,
            trend: `${Math.floor(Math.random() * 30 - 10)}%`,
          }));

        // Calculate metrics
        const totalIn = transactions
          .filter((t: any) => t.type === 'IN')
          .reduce((sum: number, t: any) => sum + t.quantity, 0);

        const totalOut = transactions
          .filter((t: any) => t.type === 'OUT')
          .reduce((sum: number, t: any) => sum + t.quantity, 0);

        const inventoryValue = products.reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0);

        setStockData(chartDataPoints.length > 0 ? chartDataPoints : [
          { month: 'Jan', stockIn: 0, stockOut: 0 },
          { month: 'Feb', stockIn: 0, stockOut: 0 },
          { month: 'Mar', stockIn: 0, stockOut: 0 },
        ]);
        setCategoryData(categoryDataList);
        setTopProducts(topProductsList);
        setMetrics({
          totalStockIn: totalIn,
          totalStockOut: totalOut,
          netMovement: totalIn - totalOut,
          inventoryValue,
        });
      } catch (err) {
        console.error('Error loading reports data:', err);
        setError('Failed to load reports data');
        notifyDataLoadError('reports');
      } finally {
        setLoading(false);
      }
    };

    loadReportsData();
  }, []);

  const handleExport = () => {
    // TODO: Implement CSV/PDF export
    alert('Export functionality coming soon');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-2">Comprehensive inventory analysis and insights.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Movement Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Stock Movement Trends</h3>
          {stockData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stockData}>
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
            <div className="h-[350px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Category Distribution</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={90}
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
            <div className="h-[350px] flex items-center justify-center text-gray-400">
              No categories
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium mb-2">Total Stock In</p>
          <p className="text-3xl font-bold text-slate-900">{metrics.totalStockIn.toLocaleString()}</p>
          <p className="text-green-600 text-sm mt-2">Units</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium mb-2">Total Stock Out</p>
          <p className="text-3xl font-bold text-slate-900">{metrics.totalStockOut.toLocaleString()}</p>
          <p className="text-blue-600 text-sm mt-2">Units</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium mb-2">Net Movement</p>
          <p className="text-3xl font-bold text-slate-900">{metrics.netMovement.toLocaleString()}</p>
          <p className={`text-sm mt-2 ${metrics.netMovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.netMovement >= 0 ? 'Stock increased' : 'Stock decreased'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm font-medium mb-2">Inventory Value</p>
          <p className="text-3xl font-bold text-slate-900">${(metrics.inventoryValue / 1000).toFixed(0)}K</p>
          <p className="text-slate-500 text-sm mt-2">Total value</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Top Moving Products</h3>
        {topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.rank} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-slate-300">#{product.rank}</span>
                  <div>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-500">{product.movement} units moved</p>
                  </div>
                </div>
                <span className={`font-semibold ${product.trend.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                  {product.trend.startsWith('-') ? '' : '↑ '}{product.trend}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No product movement data available
          </div>
        )}
      </div>
    </div>
  );
}

