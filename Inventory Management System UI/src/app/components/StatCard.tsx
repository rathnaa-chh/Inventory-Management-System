import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className = '',
}: StatCardProps) {
  const isPositive = trend && trend > 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-3">{value}</p>

          {trend !== undefined && (
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
              <span className="text-slate-500 text-xs">{trendLabel}</span>
            </div>
          )}
        </div>

        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
