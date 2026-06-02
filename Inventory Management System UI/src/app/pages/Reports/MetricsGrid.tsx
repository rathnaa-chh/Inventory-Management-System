import { TrendingUp, TrendingDown, Package, DollarSign } from 'lucide-react';
import { ReportMetrics } from './types';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  bgColor: string;
  textColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, subtext, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-xl border backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300`}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</span>
      <div className={`p-2 bg-white rounded-lg opacity-60 ${textColor}`}>{icon}</div>
    </div>
    <div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className={`text-sm mt-2 ${textColor}`}>{subtext}</p>
    </div>
  </div>
);

interface MetricsGridProps {
  metrics: ReportMetrics;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <MetricCard
      icon={<TrendingUp className="w-5 h-5" />}
      label="Stock In"
      value={metrics.totalStockIn.toLocaleString()}
      subtext="Units received"
      bgColor="bg-blue-50 border-blue-200"
      textColor="text-blue-600"
    />
    <MetricCard
      icon={<TrendingDown className="w-5 h-5" />}
      label="Stock Out"
      value={metrics.totalStockOut.toLocaleString()}
      subtext="Units distributed"
      bgColor="bg-indigo-50 border-indigo-200"
      textColor="text-indigo-600"
    />
    <MetricCard
      icon={<Package className="w-5 h-5" />}
      label="Net Movement"
      value={metrics.netMovement.toLocaleString()}
      subtext={metrics.netMovement >= 0 ? 'Stock increased' : 'Stock decreased'}
      bgColor={metrics.netMovement >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
      textColor={metrics.netMovement >= 0 ? 'text-green-600' : 'text-red-600'}
    />
    <MetricCard
      icon={<DollarSign className="w-5 h-5" />}
      label="Inventory Value"
      value={`$${(metrics.inventoryValue / 1000).toFixed(0)}K`}
      subtext="Total value"
      bgColor="bg-amber-50 border-amber-200"
      textColor="text-amber-600"
    />
  </div>
);
