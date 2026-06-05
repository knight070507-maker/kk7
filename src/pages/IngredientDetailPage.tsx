import { useParams, useNavigate } from 'react-router-dom';
import { getIngredientById } from '../data/ingredients';
import { RiskBadge } from '../components/common/RiskBadge';
import { SimpleExplanation } from '../components/ingredient/SimpleExplanation';
import { productDB } from '../data/products';

export function IngredientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <div className="text-center py-16 text-gray-400">成分不存在</div>;
  }

  const ingredient = getIngredientById(id);
  if (!ingredient) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <span className="text-5xl"></span>
        <p className="mt-4 text-lg text-gray-500">找不到这个成分</p>
        <button
          onClick={() => navigate('/ingredients')}
          className="mt-4 text-stone-700 hover:text-stone-700 font-medium"
        >
          ← 返回成分百科
        </button>
      </div>
    );
  }

  // 找到含有该成分的产品
  const relatedProducts = productDB.filter((p) =>
    p.ingredientIds.includes(ingredient.id)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 返回 */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-stone-700 mb-4 inline-flex items-center gap-1"
      >
        ← 返回
      </button>

      {/* 成分标题 */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{ingredient.name}</h1>
            <p className="text-sm text-gray-400 mt-1">{ingredient.nameEn}</p>
            {ingredient.aliases.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                别名：{ingredient.aliases.join('、')}
              </p>
            )}
          </div>
          <RiskBadge level={ingredient.riskLevel} size="lg" showEmoji />
        </div>
      </div>

      {/* 简单解释（核心） */}
      <div className="mb-6">
        <SimpleExplanation ingredient={ingredient} />
      </div>

      {/* 详细信息卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* 功能 */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h4 className="text-sm text-gray-500 mb-1">主要功能</h4>
          <p className="font-medium text-gray-800">{ingredient.function}</p>
        </div>

        {/* 分类 */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h4 className="text-sm text-gray-500 mb-1">成分分类</h4>
          <p className="font-medium text-gray-800">{ingredient.category}</p>
        </div>

        {/* 适合肤质 */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h4 className="text-sm text-gray-500 mb-2">适合的肤质</h4>
          <div className="flex flex-wrap gap-1">
            {ingredient.goodFor.length > 0 ? (
              ingredient.goodFor.map((s) => (
                <span key={s} className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{s}</span>
              ))
            ) : (
              <span className="text-xs text-gray-400">无明显偏好</span>
            )}
          </div>
        </div>

        {/* 不适合肤质 */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h4 className="text-sm text-gray-500 mb-2">不适合的肤质</h4>
          <div className="flex flex-wrap gap-1">
            {ingredient.badFor.length > 0 ? (
              ingredient.badFor.map((s) => (
                <span key={s} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">{s}</span>
              ))
            ) : (
              <span className="text-xs text-gray-400">无明显禁忌</span>
            )}
          </div>
        </div>
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ingredient.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 text-sm bg-stone-100 text-stone-700 rounded-full border border-stone-300">
            #{tag}
          </span>
        ))}
      </div>

      {/* 含有该成分的产品 */}
      {relatedProducts.length > 0 && (
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">
            含有此成分的产品（{relatedProducts.length} 个）
          </h4>
          <div className="space-y-2">
            {relatedProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-stone-100 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-medium text-gray-800">{p.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{p.brand}</span>
                </div>
                <span className="text-xs text-stone-700">查看 →</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
