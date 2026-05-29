import DataTable from '../components/DataTable';
import { useEffect, useState } from 'react';
import { transactionService } from '../../api/services';
import { Search, Calendar } from 'lucide-react';
import { useNotificationService } from '../services/notificationService';

interface Transaction {
  id: number;
  product: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  user: string;
  notes?: string;
}

export default function TransactionHistory() {
  const { notifyDataLoadError } = useNotificationService();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError('');

        const params: any = {};
        
        if (filterType !== 'ALL') {
          params.type = filterType;
        }
        
        if (searchTerm) {
          params.search = searchTerm;
        }

        const res = await transactionService.getAll(params);
        const transactionList = Array.isArray(res) ? res : res?.data || [];
        
        const formattedTransactions = transactionList.map((t: any) => ({
          id: t.id,
          product: t.product?.name || 'Unknown',
          type: t.type,
          quantity: t.quantity,
          date: new Date(t.created_at).toLocaleDateString(),
          user: t.user?.name || 'Unknown',
          notes: t.notes || '',
        }));

        setTransactions(formattedTransactions);
      } catch (err) {
        console.error('Error loading transactions:', err);
        setError('Failed to load transactions');
        notifyDataLoadError('transactions');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      loadTransactions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filterType, searchTerm, dateFilter]);

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Transaction History</h1>
        <p className="text-slate-600 mt-2">View all inventory movements and transactions.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search product or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'ALL' | 'IN' | 'OUT')}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Transactions</option>
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
          </select>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          </div>
        ) : transactions.length > 0 ? (
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
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {value === 'IN' ? 'Stock In' : 'Stock Out'}
                  </span>
                ),
              },
              { key: 'quantity', label: 'Quantity', sortable: true },
              { key: 'date', label: 'Date', sortable: true },
              { key: 'user', label: 'User', sortable: true },
              { key: 'notes', label: 'Notes', sortable: false },
            ]}
            data={transactions}
            searchPlaceholder="Search transactions..."
          />
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm">Try adjusting your filters or add a new transaction</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Total Transactions</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{transactions.length}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Stock In</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {transactions.filter(t => t.type === 'IN').length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Stock Out</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {transactions.filter(t => t.type === 'OUT').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

