import { Trophy, Flame } from 'lucide-react';
import { TopProduct } from './types';

interface TopProductsProps {
  products: TopProduct[];
}

export const TopProducts: React.FC<TopProductsProps> = ({ products }) => (
  <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6 flex items-center gap-3">
      <Trophy className="w-5 h-5 text-amber-600" />
      <div>
        <h3 className="text-lg font-bold text-slate-900">Top Moving Products</h3>
        <p className="text-sm text-slate-600 mt-1">Best performing inventory items</p>
      </div>
    </div>
    <div className="p-6">
      {products.length > 0 ? (
        <div className="space-y-3">
          {products.map((product, index) => (
            <div
              key={product.rank}
              className="group relative p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank Badge */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                      index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                      index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                      'bg-gradient-to-br from-slate-400 to-slate-600'
                    }`}>
                      #{product.rank}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-base">{product.name}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        {product.movement} units moved
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Trend */}
                <div className={`font-bold text-lg px-3 py-1 rounded-lg ${
                  product.trend.startsWith('-') 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {product.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-slate-500 font-medium">No product movement data</p>
        </div>
      )}
    </div>
  </div>
);
