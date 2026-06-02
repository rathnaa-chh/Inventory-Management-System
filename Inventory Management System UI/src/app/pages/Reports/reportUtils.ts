import { ChartDataPoint, CategoryData, TopProduct, Product, Transaction, ReportMetrics } from './types';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];

export const calculateMonthlyData = (transactions: Transaction[]): ChartDataPoint[] => {
  const monthlyData: Record<string, { in: number; out: number }> = {};

  transactions.forEach((t) => {
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

  const chartDataPoints = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    stockIn: data.in,
    stockOut: data.out,
  }));

  return chartDataPoints.length > 0
    ? chartDataPoints.slice(-6)
    : [
        { month: 'Jan', stockIn: 0, stockOut: 0 },
        { month: 'Feb', stockIn: 0, stockOut: 0 },
        { month: 'Mar', stockIn: 0, stockOut: 0 },
      ];
};

export const calculateCategoryDistribution = (products: Product[]): CategoryData[] => {
  const categoryCount: Record<string, number> = {};

  products.forEach((p) => {
    const catName = p.category?.name || 'Other';
    categoryCount[catName] = (categoryCount[catName] || 0) + 1;
  });

  return Object.entries(categoryCount).map((entry, index) => ({
    name: entry[0],
    value: entry[1],
    color: COLORS[index % COLORS.length],
  }));
};

export const calculateTopProducts = (transactions: Transaction[]): TopProduct[] => {
  const productMovement: Record<string, number> = {};

  transactions.forEach((t) => {
    const productName = t.product?.name || 'Unknown';
    productMovement[productName] = (productMovement[productName] || 0) + t.quantity;
  });

  return Object.entries(productMovement)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, movement], index) => ({
      rank: index + 1,
      name,
      movement,
      trend: `${Math.floor(Math.random() * 30 - 10)}%`,
    }));
};

export const calculateMetrics = (products: Product[], transactions: Transaction[]): ReportMetrics => {
  const totalIn = transactions
    .filter((t) => t.type === 'IN')
    .reduce((sum, t) => sum + t.quantity, 0);

  const totalOut = transactions
    .filter((t) => t.type === 'OUT')
    .reduce((sum, t) => sum + t.quantity, 0);

  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const lowStockCount = products.filter(
    (p) => p.quantity > 0 && p.quantity < (p.reorder_level || 10)
  ).length;

  const reorderCount = products.filter((p) => p.quantity === 0 || p.quantity < (p.reorder_level || 10)).length;

  return {
    totalStockIn: totalIn,
    totalStockOut: totalOut,
    netMovement: totalIn - totalOut,
    inventoryValue,
    totalProducts: products.length,
    lowStockCount,
    reorderCount,
  };
};

export const formatCurrency = (value: number): string => {
  return `$${(value / 1000).toFixed(0)}K`;
};

export const getProductStatus = (product: Product): { label: string; color: number[] } => {
  if (product.quantity === 0) {
    return { label: 'OUT', color: [153, 27, 27] };
  }
  if (product.quantity < (product.reorder_level || 10)) {
    return { label: 'LOW', color: [146, 64, 14] };
  }
  return { label: 'IN', color: [22, 163, 74] };
};
