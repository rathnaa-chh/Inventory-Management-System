import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { transactionService } from '../../api/services/transactions';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getAll();
      
      // Transform API data to match table format
      // response.data is the paginated array from Laravel
      const transactionArray = Array.isArray(response.data) ? response.data : response.data?.data || [];
      
      const formattedData = transactionArray.map((transaction: any) => ({
        id: transaction.id,
        product: transaction.product?.name || 'Unknown Product',
        type: transaction.type,
        quantity: transaction.quantity,
        date: new Date(transaction.created_at).toLocaleDateString(),
        user: transaction.user?.name || 'Unknown User',
        notes: transaction.notes || '-',
      }));
      
      setTransactions(formattedData);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Transaction History</h1>
        <p className="text-slate-600 mt-2">View all inventory movements and transactions.</p>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-slate-600">Loading transactions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchTransactions}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
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
              { key: 'notes', label: 'Notes', sortable: false },
            ]}
            data={transactions}
            searchPlaceholder="Search transactions..."
          />
        )}
      </div>
    </div>
  );
}
