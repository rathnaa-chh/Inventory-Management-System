import DataTable from '../components/DataTable';

const transactionData = [
  {
    id: 1,
    product: 'Laptop Pro',
    type: 'IN',
    quantity: 10,
    date: '2024-01-15',
    user: 'John Doe',
    notes: 'New stock received',
  },
  {
    id: 2,
    product: 'Mouse Wireless',
    type: 'OUT',
    quantity: 25,
    date: '2024-01-14',
    user: 'Jane Smith',
    notes: 'Customer purchase',
  },
  {
    id: 3,
    product: 'Keyboard RGB',
    type: 'IN',
    quantity: 50,
    date: '2024-01-13',
    user: 'John Doe',
    notes: 'Restocking',
  },
  {
    id: 4,
    product: 'Monitor 4K',
    type: 'OUT',
    quantity: 5,
    date: '2024-01-12',
    user: 'Mike Johnson',
    notes: 'Warehouse transfer',
  },
  {
    id: 5,
    product: 'USB Cable',
    type: 'IN',
    quantity: 100,
    date: '2024-01-11',
    user: 'Jane Smith',
    notes: 'Bulk order',
  },
];

export default function TransactionHistory() {
  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Transaction History</h1>
        <p className="text-slate-600 mt-2">View all inventory movements and transactions.</p>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
          data={transactionData}
          searchPlaceholder="Search transactions..."
        />
      </div>
    </div>
  );
}
