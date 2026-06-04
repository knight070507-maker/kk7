import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProductById, productDB, productCategoryLabels } from '../data/products';
import { getIngredientsByIds } from '../data/ingredients';
import { analyzeProduct, getRatingLabel } from '../utils/analysis';
import { RiskBadge } from '../components/common/RiskBadge';
import type { Product, ProductAnalysis } from '../types';

interface CompareItem {
  product: Product;
  analysis: ProductAnalysis;
  ingredients: ReturnType<typeof getIngredientsByIds>;
}

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [left, setLeft] = useState<CompareItem | null>(null);
  const [right, setRight] = useState<CompareItem | null>(null);
  const [picker, setPicker] = useState<'left' | 'right' | null>(null);
  const [filter, setFilter] = useState('');

  // 从URL恢复
  useEffect(() => {
    const a = searchParams.get('a'); const b = searchParams.get('b');
    if (a) selectProduct(a, 'left');
    if (b) selectProduct(b, 'right');
  }, []);

  const selectProduct = (id: string, side: 'left' | 'right') => {
    const p = getProductById(id);
    if (!p) return;
    const analysis = analyzeProduct(p);
    const ingredients = getIngredientsByIds(p.ingredientIds);
    const item = { product: p, analysis, ingredients };
    if (side === 'left') { setLeft(item); setParams('a', id); }
    else { setRight(item); setParams('b', id); }
    setPicker(null); setFilter('');
  };

  const setParams = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, val); setSearchParams(params);
  };

  const products = productDB.filter(p =>
    (!left || p.id !== left.product.id) && (!right || p.id !== right.product.id) &&
    (!filter || p.name.toLowerCase().includes(filter.toLowerCase()) || p.brand.toLowerCase().includes(filter.toLowerCase()))
  );

  const renderSide = (item: CompareItem | null, side: 'left' | 'right') => (
    <div className="flex-1 min-w-0">
      {item ? (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-800 text-sm truncate">{item.product.name}</h3>
            <button onClick={() => side === 'left' ? (setLeft(null), setParams('a', '')) : (setRight(null), setParams('b', ''))}
              className="text-xs text-red-400 hover:text-red-600 ml-1">✕ 移除</button>
          </div>
          <p className="text-xs text-gray-400 mb-2">{item.product.brand} · {item.product.price ? `¥${item.product.price}` : ''}{item.product.capacity ? ` / ${item.product.capacity}` : ''}</p>
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
            <span>🔴 {item.analysis.harmfulCount}</span>
            <span>🟡 {item.analysis.irritantCount}</span>
            <span>⚪ {item.analysis.comedogenicCount}</span>
          </div>
          <span className={`text-sm font-bold ${item.analysis.overallRating === 'safe' ? 'text-green-600' : item.analysis.overallRating === 'caution' ? 'text-yellow-600' : 'text-red-600'}`}>
            {getRatingLabel(item.analysis.overallRating)}
          </span>
          <div className="mt-3 space-y-1.5">
            <h4 className="text-xs font-semibold text-gray-500">成分对比（{item.ingredients.length}种）</h4>
            {item.ingredients.map((ing, i) => (
              <div key={ing.id} className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 w-4">{i + 1}</span>
                <div className={`w-1.5 h-4 rounded-full ${ing.riskLevel === 0 ? 'bg-green-400' : ing.riskLevel === 1 ? 'bg-yellow-400' : ing.riskLevel === 2 ? 'bg-orange-400' : 'bg-red-400'}`} />
                <span className="text-gray-700 truncate flex-1 cursor-pointer hover:text-purple-600" onClick={() => navigate(`/ingredient/${ing.id}`)}>{ing.name}</span>
                <RiskBadge level={ing.riskLevel} size="sm" showLabel={false} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button onClick={() => setPicker(side)}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-purple-300 hover:text-purple-400 transition-colors">
          <div className="text-center">
            <span className="text-3xl block mb-2">📦</span>
            <span className="text-sm">点击选择产品</span>
          </div>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">📊 产品成分对比</h1>
      <p className="text-sm text-gray-500 mb-6">选择两个产品，并排对比它们的成分和安全性。</p>

      {/* 对比区域 */}
      <div className="flex gap-4 mb-6">
        {renderSide(left, 'left')}
        <div className="flex items-center text-2xl text-gray-300 shrink-0">VS</div>
        {renderSide(right, 'right')}
      </div>

      {/* 产品选择器 */}
      {picker && (
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">选择要对比的产品</h3>
            <button onClick={() => setPicker(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="搜索产品..." className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:border-purple-400 outline-none mb-3" />
          <div className="max-h-64 overflow-y-auto space-y-1">
            {products.slice(0, 20).map(p => (
              <button key={p.id} onClick={() => selectProduct(p.id, picker)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 flex items-center justify-between transition-colors">
                <div>
                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{p.brand}</span>
                </div>
                <span className="text-xs text-gray-400">{productCategoryLabels[p.category]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 快捷入口 */}
      {!picker && !left && !right && (
        <div className="text-center py-8 text-gray-400">
          <span className="text-5xl">📊</span>
          <p className="mt-4">点击左右任意一个空白区域，选择产品开始对比</p>
          <p className="text-sm mt-1">选好两个产品后，可以看到它们的成分并排展示</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-50 rounded-xl text-xs text-purple-600">
        💡 提示：对比完成后可以复制链接分享给朋友。链接会保存你的对比选择。
      </div>
    </div>
  );
}
