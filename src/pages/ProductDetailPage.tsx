import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, productCategoryLabels } from '../data/products';
import { getIngredientsByIds } from '../data/ingredients';
import { analyzeProduct } from '../utils/analysis';
import { ProductAnalysisSummary } from '../components/product/ProductAnalysis';
import { IngredientBreakdown } from '../components/product/IngredientBreakdown';
import { PriceTierLabel, ValueRatingLabel, ValueRatingColor } from '../types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return <div className="text-center py-16 text-gray-400">产品不存在</div>;

  const product = getProductById(id);
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <span className="text-5xl">😕</span>
        <p className="mt-4 text-lg text-gray-500">找不到这个产品</p>
        <button onClick={() => navigate('/')} className="mt-4 text-purple-600 hover:text-purple-700 font-medium">
          ← 返回首页
        </button>
      </div>
    );
  }

  const ingredients = getIngredientsByIds(product.ingredientIds);
  const analysis = analyzeProduct(product);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回 */}
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-purple-600 mb-4 inline-flex items-center gap-1">
        ← 返回
      </button>

      {/* 产品标题 */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
            {productCategoryLabels[product.category]}
          </span>
          <span className="text-sm text-gray-500">{product.brand}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
        {product.summary && (
          <p className="mt-2 text-gray-500 text-sm">💬 {product.summary}</p>
        )}
      </div>

      {/* 价格和性价比 */}
      {product.price && (
        <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-800">¥{product.price}</span>
              {product.capacity && <span className="text-sm text-gray-400">/ {product.capacity}</span>}
            </div>
            {product.priceTier && (
              <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full font-medium">
                {PriceTierLabel[product.priceTier]}
              </span>
            )}
            {product.valueRating && (
              <span className={`px-3 py-1 text-sm rounded-full border font-bold ${ValueRatingColor[product.valueRating]}`}>
                {ValueRatingLabel[product.valueRating]}
              </span>
            )}
          </div>
          {product.valueNote && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">💸 {product.valueNote}</p>
            </div>
          )}
        </div>
      )}

      {/* 结构化描述 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 适合肤质 */}
        {product.suitableFor && product.suitableFor.length > 0 && (
          <div className="p-4 bg-white rounded-xl border border-green-200">
            <h4 className="text-sm font-semibold text-green-700 mb-2">✅ 适合肤质</h4>
            <div className="flex flex-wrap gap-1">
              {product.suitableFor.map((s) => (
                <span key={s} className="px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* 针对问题 */}
        {product.targets && product.targets.length > 0 && (
          <div className="p-4 bg-white rounded-xl border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-700 mb-2">🎯 针对问题</h4>
            <div className="flex flex-wrap gap-1">
              {product.targets.map((t) => (
                <span key={t} className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* 优点 */}
        {product.pros && product.pros.length > 0 && (
          <div className="p-4 bg-white rounded-xl border border-emerald-200">
            <h4 className="text-sm font-semibold text-emerald-700 mb-2">👍 优点</h4>
            <ul className="space-y-1">
              {product.pros.map((p) => (
                <li key={p} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span> {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 缺点 */}
        {product.cons && product.cons.length > 0 && (
          <div className="p-4 bg-white rounded-xl border border-orange-200">
            <h4 className="text-sm font-semibold text-orange-700 mb-2">👎 缺点</h4>
            <ul className="space-y-1">
              {product.cons.map((c) => (
                <li key={c} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5">•</span> {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 成分分析总览 */}
      <div className="mb-8">
        <ProductAnalysisSummary analysis={analysis} />
      </div>

      {/* 完整成分列表 */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
        <IngredientBreakdown ingredients={ingredients} />
      </div>

      {/* 底部提示 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700">
        💡 <strong>温馨提示：</strong>成分表按含量从高到低排列，排名越靠前含量越高。一般前5-7种成分占了产品的大部分。
      </div>
    </div>
  );
}
