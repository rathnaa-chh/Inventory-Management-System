import { useEffect, useState } from 'react';
import PageLoader from '../components/PageLoader';
import { productService, transactionService } from '../../api/services';
import { useNotificationService } from '../services/notificationService';
import {
  calculateMonthlyData,
  calculateCategoryDistribution,
  calculateTopProducts,
  calculateMetrics,
} from './Reports/reportUtils';
import { generateInventoryPDF } from './Reports/pdfGenerator';
import { Charts } from './Reports/Charts';
import { MetricsGrid } from './Reports/MetricsGrid';
import { TopProducts } from './Reports/TopProducts';
import { ReportHeader } from './Reports/header';
import type { ChartDataPoint, CategoryData, TopProduct, Product, Transaction, ReportMetrics } from './Reports/types';

export default function Reports() {
  const { notifyDataLoadError } = useNotificationService();

  const [stockData, setStockData] = useState<ChartDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<ReportMetrics>({
    totalStockIn: 0,
    totalStockOut: 0,
    netMovement: 0,
    inventoryValue: 0,
    totalProducts: 0,
    lowStockCount: 0,
    reorderCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError('');

      const [transactionsRes, productsRes] = await Promise.all([
        transactionService.getAll(),
        productService.getAll(),
      ]);

      const transactions: Transaction[] = Array.isArray(transactionsRes)
        ? transactionsRes
        : transactionsRes?.data || [];
      const productsData: Product[] = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];

      setProducts(productsData);

      // Calculate all report data
      const monthly = calculateMonthlyData(transactions);
      const categories = calculateCategoryDistribution(productsData);
      const topProds = calculateTopProducts(transactions);
      const reportMetrics = calculateMetrics(productsData, transactions);

      setStockData(monthly);
      setCategoryData(categories);
      setTopProducts(topProds);
      setMetrics(reportMetrics);
    } catch (err) {
      console.error('Error loading reports data:', err);
      setError('Failed to load reports data');
      notifyDataLoadError('reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    try {
      generateInventoryPDF(products, metrics);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      notifyDataLoadError('PDF export');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <PageLoader message="Loading reports data..." />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Professional Header */}
      <ReportHeader 
        onExport={handleExportPDF}
        onRefresh={loadReportsData}
        loading={loading}
      />

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Charts Section */}
      <Charts stockData={stockData} categoryData={categoryData} />

      {/* Key Metrics */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Key Performance Metrics</h2>
          <p className="text-slate-600 mt-1">Overview of your inventory performance</p>
        </div>
        <MetricsGrid metrics={metrics} />
      </div>

      {/* Top Products */}
      <div>
        <TopProducts products={topProducts} />
      </div>
    </div>
  );
}

