import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint, CategoryData } from './types';

interface ChartsProps {
  stockData: ChartDataPoint[];
  categoryData: CategoryData[];
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="h-96 flex flex-col items-center justify-center text-gray-400">
    <div className="text-6xl mb-4">📊</div>
    <p className="text-lg">{message}</p>
  </div>
);

export const Charts: React.FC<ChartsProps> = ({ stockData, categoryData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Stock Movement Chart */}
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900">Stock Movement Trends</h3>
        <p className="text-sm text-slate-600 mt-1">Last 6 months inventory flow</p>
      </div>
      <div className="p-6">
        {stockData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stockData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="stockIn" fill="#3B82F6" name="Stock In" radius={[8, 8, 0, 0]} />
              <Bar dataKey="stockOut" fill="#10B981" name="Stock Out" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="No data available" />
        )}
      </div>
    </div>

    {/* Category Distribution */}
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900">Category Distribution</h3>
        <p className="text-sm text-slate-600 mt-1">Products by category</p>
      </div>
      <div className="p-6">
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
          <EmptyState message="No categories available" />
        )}
      </div>
    </div>
  </div>
);
