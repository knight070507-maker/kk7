import { Product, ProductAnalysis, ValueRatingColor, ValueRatingLabel, PriceTierLabel } from '../../types';
import { useNavigate } from 'react-router-dom';
import { productCategoryLabels } from '../../data/products';
import { getRatingLabel } from '../../utils/analysis';

interface ProductCardProps {
  product: Product;
  analysis: ProductAnalysis;
}

export function ProductCard({ product, analysis }: ProductCardProps) {
  const navigate = useNavigate();

  const getRatingColor = () => {
    switch (analysis.overallRating) {
      case 'safe': return 'bg-green-50 border-green-200';
      case 'caution': return 'bg-yellow-50 border-yellow-200';
      case 'warning': return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className={`p-4 rounded-xl border-2 ${getRatingColor()} hover:shadow-lg cursor-pointer transition-all`}
    >
      {/* 品牌和类别 */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs px-2 py-0.5 bg-white rounded-full border border-gray-200 text-gray-500">
          {productCategoryLabels[product.category]}
        </span>
        <span className="text-xs text-gray-400">{product.brand}</span>
      </div>

      {/* 产品名 */}
      <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>

      {/* 一句话总结 */}
      {product.summary && (
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.summary}</p>
      )}

      {/* 价格和性价比 */}
      {product.price && (
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-sm font-bold text-gray-700">¥{product.price}</span>
          {product.capacity && <span className="text-xs text-gray-400">/ {product.capacity}</span>}
          {product.valueRating && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full border ${ValueRatingColor[product.valueRating]}`}>
              {ValueRatingLabel[product.valueRating]}
            </span>
          )}
        </div>
      )}

      {/* 风险摘要 */}
      <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
        <span>🔴 <span className="font-medium">{analysis.harmfulCount}</span> 有害</span>
        <span>🟡 <span className="font-medium">{analysis.irritantCount}</span> 刺激</span>
        <span>⚪ <span className="font-medium">{analysis.comedogenicCount}</span> 致痘</span>
      </div>

      {/* 总体评级 */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${
          analysis.overallRating === 'safe' ? 'text-green-600' :
          analysis.overallRating === 'caution' ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {getRatingLabel(analysis.overallRating)}
        </span>
        <span className="text-xs text-purple-600 font-medium">查看详情 →</span>
      </div>
    </div>
  );
}
