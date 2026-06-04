import { Product, ProductAnalysis, ValueRatingColor, ValueRatingLabel } from '../../types';
import { useNavigate } from 'react-router-dom';
import { productCategoryLabels } from '../../data/products';
import { getRatingLabel } from '../../utils/analysis';

const categoryEmoji: Record<string, string> = {
  cleanser: '🧼', toner: '💧', serum: '🧪', moisturizer: '🧴', sunscreen: '☀️', mask: '🎭', other: '📦',
};

interface ProductCardProps { product: Product; analysis: ProductAnalysis; }

export function ProductCard({ product, analysis }: ProductCardProps) {
  const navigate = useNavigate();

  const getRatingColor = () => {
    switch (analysis.overallRating) {
      case 'safe': return 'from-green-50 to-emerald-50 border-green-200';
      case 'caution': return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'warning': return 'from-red-50 to-rose-50 border-red-200';
    }
  };

  return (
    <div onClick={() => navigate(`/product/${product.id}`)}
      className={`p-4 rounded-xl border-2 bg-gradient-to-br ${getRatingColor()} hover:shadow-lg cursor-pointer transition-all`}>
      {/* 类别图标 + 品牌 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{categoryEmoji[product.category] || '📦'}</span>
          <span className="text-xs px-2 py-0.5 bg-white/80 rounded-full border border-gray-200 text-gray-500">{productCategoryLabels[product.category]}</span>
        </div>
        <span className="text-xs text-gray-400">{product.brand}</span>
      </div>

      <h3 className="font-semibold text-gray-800 mb-1 text-sm">{product.name}</h3>
      {product.summary && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.summary}</p>}

      {product.price && (
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-sm font-bold text-gray-700">¥{product.price}</span>
          {product.capacity && <span className="text-xs text-gray-400">/ {product.capacity}</span>}
          {product.valueRating && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full border ${ValueRatingColor[product.valueRating]}`}>{ValueRatingLabel[product.valueRating]}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
        <span>🔴 <span className="font-medium">{analysis.harmfulCount}</span></span>
        <span>🟡 <span className="font-medium">{analysis.irritantCount}</span></span>
        <span>⚪ <span className="font-medium">{analysis.comedogenicCount}</span></span>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${analysis.overallRating === 'safe' ? 'text-green-600' : analysis.overallRating === 'caution' ? 'text-yellow-600' : 'text-red-600'}`}>
          {getRatingLabel(analysis.overallRating)}
        </span>
        <span className="text-xs text-purple-600 font-medium">查看详情 →</span>
      </div>
    </div>
  );
}
