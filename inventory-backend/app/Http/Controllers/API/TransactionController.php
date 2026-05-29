<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    /**
     * Get all transactions
     */
    public function index(Request $request)
    {
        $query = Transaction::with(['product', 'user']);

        // Filter by type (IN/OUT)
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by product
        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Search by notes
        if ($request->has('search')) {
            $query->where('notes', 'like', '%' . $request->search . '%');
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    /**
     * Create a transaction (stock in or out)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:IN,OUT',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();

        // Get the product
        $product = Product::find($validated['product_id']);

        // Update product quantity based on transaction type
        if ($validated['type'] === 'IN') {
            $product->quantity += $validated['quantity'];
        } else {
            // Check if there's enough stock for OUT
            if ($product->quantity < $validated['quantity']) {
                return response()->json([
                    'message' => 'Insufficient stock for this transaction',
                    'available' => $product->quantity,
                    'requested' => $validated['quantity'],
                ], 422);
            }
            $product->quantity -= $validated['quantity'];
        }

        $product->save();

        // Create transaction record
        $transaction = Transaction::create($validated);

        return response()->json([
            'message' => 'Transaction created successfully',
            'transaction' => $transaction->load(['product', 'user']),
        ], 201);
    }

    /**
     * Get a specific transaction
     */
    public function show(int $id)
    {
        $transaction = Transaction::with(['product', 'user'])->findOrFail($id);
        return $transaction;
    }

    /**
     * Get transactions summary/statistics
     */
    public function summary(Request $request)
    {
        $startDate = $request->query('from_date', now()->subDays(30));
        $endDate = $request->query('to_date', now());

        $totalIn = Transaction::where('type', 'IN')
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->sum('quantity');

        $totalOut = Transaction::where('type', 'OUT')
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->sum('quantity');

        $transactionCount = Transaction::whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->count();

        $monthlyData = Transaction::selectRaw('
                DATE_FORMAT(created_at, "%Y-%m") as month,
                type,
                SUM(quantity) as total
            ')
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->groupBy('month', 'type')
            ->get();

        return response()->json([
            'total_in' => $totalIn,
            'total_out' => $totalOut,
            'net_change' => $totalIn - $totalOut,
            'transaction_count' => $transactionCount,
            'monthly_data' => $monthlyData,
        ]);
    }

    /**
     * Get low stock products
     */
    public function lowStock(Request $request)
    {
        $threshold = $request->query('threshold', 10);

        $lowStockProducts = Product::where('quantity', '<', $threshold)
            ->with('category')
            ->orderBy('quantity')
            ->get();

        return response()->json([
            'threshold' => $threshold,
            'count' => $lowStockProducts->count(),
            'products' => $lowStockProducts,
        ]);
    }
    
}
