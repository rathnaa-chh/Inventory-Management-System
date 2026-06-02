export interface ChartDataPoint {
  month: string;
  stockIn: number;
  stockOut: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface TopProduct {
  rank: number;
  name: string;
  movement: number;
  trend: string;
}

export interface Product {
  id: number;
  name: string;
  category?: { name: string };
  price: number;
  quantity: number;
  reorder_level?: number;
  supplier?: string;
}

export interface ReportMetrics {
  totalStockIn: number;
  totalStockOut: number;
  netMovement: number;
  inventoryValue: number;
  totalProducts: number;
  lowStockCount: number;
  reorderCount: number;
}

export interface Transaction {
  id: number;
  product?: { name: string };
  quantity: number;
  type: 'IN' | 'OUT';
  created_at: string;
}
