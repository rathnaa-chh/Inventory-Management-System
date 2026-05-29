import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { productService, transactionService } from '../../api/services';
import { useNotificationService } from '../services/notificationService';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category_id: number;
}

interface RecentStockOut {
  id: number;
  product: string;
  quantity: number;
  date: string;
  reason?: string;
}

export default function StockOut() {
  const { notifyTransactionSuccess, notifyTransactionError, notifyDataLoadError } = useNotificationService();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [recentEntries, setRecentEntries] = useState<RecentStockOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.getAll();
        const productList = Array.isArray(res) ? res : res?.data || [];
        setProducts(productList);
        
        // Load recent stock out transactions
        const transactionsRes = await transactionService.getAll({ type: 'OUT', limit: 5 });
        const transactions = Array.isArray(transactionsRes) ? transactionsRes : transactionsRes?.data || [];
        const formattedTransactions = transactions.map((t: any) => ({
          id: t.id,
          product: t.product?.name || 'Unknown',
          quantity: t.quantity,
          date: new Date(t.created_at).toLocaleDateString(),
          reason: t.notes,
        }));
        setRecentEntries(formattedTransactions);
      } catch (err) {
        notifyDataLoadError('products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.product_id || !formData.quantity || !formData.reason) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    const quantity = parseInt(formData.quantity);
    if (quantity <= 0) {
      setErrorMessage('Quantity must be greater than 0');
      return;
    }

    setSubmitLoading(true);

    try {
      const selectedProduct = products.find(p => p.id === parseInt(formData.product_id));
      const productName = selectedProduct?.name || 'Unknown';

      const response = await transactionService.create({
        product_id: parseInt(formData.product_id),
        type: 'OUT',
        quantity,
        notes: `${formData.reason}${formData.notes ? ' - ' + formData.notes : ''}`,
      });

      notifyTransactionSuccess('OUT', productName, quantity);
      setSuccessMessage(`Stock out recorded successfully! Removed ${quantity} units.`);

      // Reset form
      setFormData({
        product_id: '',
        quantity: '',
        reason: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });

      // Reload recent entries
      const transactionsRes = await transactionService.getAll({ type: 'OUT', limit: 5 });
      const transactions = Array.isArray(transactionsRes) ? transactionsRes : transactionsRes?.data || [];
      const formattedTransactions = transactions.map((t: any) => ({
        id: t.id,
        product: t.product?.name || 'Unknown',
        quantity: t.quantity,
        date: new Date(t.created_at).toLocaleDateString(),
        reason: t.notes,
      }));
      setRecentEntries(formattedTransactions);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to record stock out';
      setErrorMessage(errorMsg);
      notifyTransactionError(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const getSelectedProduct = () => {
    return products.find((p: Product) => p.id === parseInt(formData.product_id));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Stock Out</h1>
        <p className="text-slate-600 mt-2">Record outgoing inventory movements.</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <div>
            <Label className="text-base font-semibold">Product *</Label>
                <Select
                  value={formData.product_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, product_id: value });
                    setErrorMessage('');
                  }}
                >
              <SelectTrigger className="mt-2 h-10">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.length > 0 ? (
                  products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - ${parseFloat(String(product.price)).toFixed(2)} (Current: {product.quantity})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No products available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Current Stock Info */}
          {getSelectedProduct() && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Current Stock:</strong> {getSelectedProduct()?.quantity} units
              </p>
            </div>
          )}

          {/* Quantity */}
          <div>
            <Label className="text-base font-semibold">Quantity *</Label>
            <Input
              type="number"
              placeholder="Enter quantity"
              min="1"
              className="mt-2"
              value={formData.quantity}
              onChange={(e) => {
                setFormData({ ...formData, quantity: e.target.value });
                setErrorMessage('');
              }}
            />
          </div>

          {/* Reason */}
          <div>
            <Label className="text-base font-semibold">Reason *</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) => {
                setFormData({ ...formData, reason: value });
                setErrorMessage('');
              }}
            >
              <SelectTrigger className="mt-2 h-10">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sale">Sale</SelectItem>
                <SelectItem value="Return">Return</SelectItem>
                <SelectItem value="Damage">Damage</SelectItem>
                <SelectItem value="Adjustment">Adjustment</SelectItem>
                <SelectItem value="Transfer">Transfer</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label className="text-base font-semibold">Date</Label>
            <div className="relative mt-2">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <Input
                type="date"
                className="pl-10"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-base font-semibold">Notes (Optional)</Label>
            <textarea
              placeholder="Add any additional notes about this stock out..."
              className="w-full mt-2 px-4 py-3 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setFormData({
                  product_id: '',
                  quantity: '',
                  reason: '',
                  date: new Date().toISOString().split('T')[0],
                  notes: '',
                });
                setErrorMessage('');
              }}
              disabled={submitLoading}
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={submitLoading || products.length === 0}
            >
              {submitLoading ? 'Recording...' : 'Record Stock Out'}
            </Button>
          </div>
        </form>
      </div>

      {/* Recent Stock Out */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Stock Out Entries</h3>
        {recentEntries.length > 0 ? (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{entry.product}</p>
                  <p className="text-sm text-slate-500">Date: {entry.date} {entry.reason && `• Reason: ${entry.reason}`}</p>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                  -{entry.quantity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            No stock out entries yet
          </div>
        )}
      </div>
    </div>
  );
}
function setErrorMessage(errorMsg: string) {
  throw new Error('Function not implemented.');
}

function setSubmitLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

