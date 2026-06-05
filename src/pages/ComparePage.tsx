import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProductById, productDB, productCategoryLabels } from '../data/products';
import { getIngredientsByIds } from '../data/ingredients';
import { analyzeProduct, getRatingLabel } from '../utils/analysis';
import { RiskBadge } from '../components/common/RiskBadge';
import type { Product, Ingredient, ProductAnalysis } from '../types';

interface CompareItem { product: Product; analysis: ProductAnalysis; ingredients: Ingredient[]; }

// 计算每毫升/每克价格
function pricePerUnit(p: Product): string {
  if (!p.price || !p.capacity) return '';
  const num = parseFloat(p.capacity);
  if (!num) return '';
  const perUnit = p.price / num;
  if (p.capacity.includes('ml')) return `¥${perUnit.toFixed(1)}/ml`;
  if (p.capacity.includes('g')) return `¥${perUnit.toFixed(1)}/g`;
  if (p.capacity.includes('片')) return `¥${perUnit.toFixed(1)}/片`;
  return `¥${perUnit.toFixed(2)}/单位`;
}

// 智能结论
function generateConclusion(a: CompareItem, b: CompareItem): string[] {
  const lines: string[] = [];
  const aScore = a.analysis.harmfulCount * 3 + a.analysis.irritantCount * 2 + a.analysis.comedogenicCount;
  const bScore = b.analysis.harmfulCount * 3 + b.analysis.irritantCount * 2 + b.analysis.comedogenicCount;

  if (aScore < bScore) lines.push(`🛡️ 安全性：「${a.product.name}」风险成分更少，整体更安全。`);
  else if (bScore < aScore) lines.push(`🛡️ 安全性：「${b.product.name}」风险成分更少，整体更安全。`);
  else lines.push('🛡️ 安全性：两款产品风险水平相当。');

  const aSensitive = a.ingredients.filter(i => i.badFor.includes('敏感肌')).length;
  const bSensitive = b.ingredients.filter(i => i.badFor.includes('敏感肌')).length;
  if (aSensitive < bSensitive) lines.push(`🌹 敏感肌：「${a.product.name}」对敏感肌更友好（${aSensitive} vs ${bSensitive}个不利成分）。`);
  else if (bSensitive < aSensitive) lines.push(`🌹 敏感肌：「${b.product.name}」对敏感肌更友好（${bSensitive} vs ${aSensitive}个不利成分）。`);

  const aAcne = a.ingredients.filter(i => i.isComedogenic).length;
  const bAcne = b.ingredients.filter(i => i.isComedogenic).length;
  if (aAcne < bAcne) lines.push(`🔴 痘痘肌：「${a.product.name}」致痘成分更少（${aAcne} vs ${bAcne}个）。`);
  else if (bAcne < aAcne) lines.push(`🔴 痘痘肌：「${b.product.name}」致痘成分更少（${bAcne} vs ${aAcne}个）。`);

  if (a.product.price && b.product.price) {
    const aPU = pricePerUnit(a.product); const bPU = pricePerUnit(b.product);
    if (aPU && bPU) {
      const aVal = parseFloat(aPU.replace(/[^0-9.]/g, ''));
      const bVal = parseFloat(bPU.replace(/[^0-9.]/g, ''));
      if (aVal < bVal) lines.push(`💰 单价：「${a.product.name}」更便宜（${aPU} vs ${bPU}）。`);
      else if (bVal < aVal) lines.push(`💰 单价：「${b.product.name}」更便宜（${bPU} vs ${aPU}）。`);
    }
  }

  return lines;
}

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [left, setLeft] = useState<CompareItem | null>(null);
  const [right, setRight] = useState<CompareItem | null>(null);
  const [picker, setPicker] = useState<'left' | 'right' | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const a = searchParams.get('a'); const b = searchParams.get('b');
    if (a) selectProduct(a, 'left');
    if (b) selectProduct(b, 'right');
  }, []);

  useEffect(() => { document.title = '产品对比 - 成分说明书'; }, []);

  const selectProduct = (id: string, side: 'left' | 'right') => {
    const p = getProductById(id); if (!p) return;
    const analysis = analyzeProduct(p);
    const ingredients = getIngredientsByIds(p.ingredientIds);
    const item = { product: p, analysis, ingredients };
    if (side === 'left') { setLeft(item); setParams('a', id); }
    else { setRight(item); setParams('b', id); }
    setPicker(null); setFilter('');
  };

  const setParams = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set(key, val); else params.delete(key);
    setSearchParams(params);
  };

  const products = productDB.filter(p =>
    (!left || p.id !== left.product.id) && (!right || p.id !== right.product.id) &&
    (!filter || p.name.toLowerCase().includes(filter.toLowerCase()) || p.brand.toLowerCase().includes(filter.toLowerCase()))
  );

  // 成分对比分析
  const comparison = useMemo(() => {
    if (!left || !right) return null;
    const leftIds = new Set(left.ingredients.map(i => i.id));
    const rightIds = new Set(right.ingredients.map(i => i.id));
    const shared = left.ingredients.filter(i => rightIds.has(i.id));
    const leftOnly = left.ingredients.filter(i => !rightIds.has(i.id));
    const rightOnly = right.ingredients.filter(i => !leftIds.has(i.id));
    const overlapPct = left.ingredients.length > 0 ? Math.round((shared.length / left.ingredients.length) * 100) : 0;
    const conclusion = generateConclusion(left, right);
    return { shared, leftOnly, rightOnly, overlapPct, conclusion };
  }, [left, right]);

  const renderSide = (item: CompareItem | null, side: 'left' | 'right') => (
    <div className="flex-1 min-w-0">
      {item ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate flex-1">{item.product.name}</h3>
            <button onClick={() => side === 'left' ? (setLeft(null), setParams('a', '')) : (setRight(null), setParams('b', ''))}
              className="text-xs text-red-400 hover:text-red-600 ml-1 shrink-0" aria-label={`移除${item.product.name}`}>✕ 移除</button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{item.product.brand} · ¥{item.product.price || '?'}{item.product.capacity ? ` / ${item.product.capacity}` : ''} · {pricePerUnit(item.product)}</p>

          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
            <span className="text-red-500">🔴{item.analysis.harmfulCount}</span>
            <span className="text-yellow-500">🟡{item.analysis.irritantCount}</span>
            <span className="text-orange-400">⚪{item.analysis.comedogenicCount}</span>
            <span className={`font-bold ${item.analysis.overallRating === 'safe' ? 'text-green-600' : item.analysis.overallRating === 'caution' ? 'text-yellow-600' : 'text-red-600'}`}>
              {getRatingLabel(item.analysis.overallRating)}
            </span>
          </div>

          <div className="mt-3 space-y-1">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400">成分列表（{item.ingredients.length}种）</h4>
            {item.ingredients.map((ing, i) => {
              const isShared = comparison?.shared.some(s => s.id === ing.id);
              return (
                <div key={ing.id} className={`flex items-center gap-1.5 text-xs py-0.5 px-1 rounded ${isShared ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : ''}`}>
                  <span className="text-gray-400 w-3">{i + 1}</span>
                  <div className={`w-1 h-3 rounded-full ${ing.riskLevel === 0 ? 'bg-green-400' : ing.riskLevel === 1 ? 'bg-yellow-400' : ing.riskLevel === 2 ? 'bg-orange-400' : 'bg-red-400'}`} />
                  <span className="text-gray-700 dark:text-gray-300 truncate flex-1 cursor-pointer hover:text-purple-600" onClick={() => navigate(`/ingredient/${ing.id}`)}>{ing.name}</span>
                  {isShared && <span className="text-green-500 text-xs shrink-0">相同</span>}
                  <RiskBadge level={ing.riskLevel} size="sm" showLabel={false} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <button onClick={() => setPicker(side)} aria-label="选择产品进行对比"
          className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:border-purple-400 hover:text-purple-400 transition-colors">
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
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">📊 产品成分对比</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">并排对比成分、安全性、性价比——帮你做出护肤决策。</p>

      {/* 对比区 */}
      <div className="flex gap-3 md:gap-4 mb-6">
        {renderSide(left, 'left')}
        <div className="flex items-center text-xl text-gray-300 dark:text-gray-600 shrink-0 font-bold">VS</div>
        {renderSide(right, 'right')}
      </div>

      {/* 对比分析结论 */}
      {comparison && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-3">🧠 对比分析结论</h2>

          {/* 重叠度 */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">成分重叠度</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{comparison.overlapPct}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full transition-all" style={{ width: `${comparison.overlapPct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {comparison.overlapPct > 60 ? '两款产品核心配方相似，可能有替代关系。' :
               comparison.overlapPct > 30 ? '两款产品部分成分相同，但各有侧重。' :
               '两款产品配方差异较大，定位不同。'}
            </p>
          </div>

          {/* 相同成分 */}
          {comparison.shared.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">✅ 相同成分（{comparison.shared.length}种）</h3>
              <div className="flex flex-wrap gap-1">
                {comparison.shared.map(ing => (
                  <span key={ing.id} onClick={() => navigate(`/ingredient/${ing.id}`)}
                    className="px-2 py-0.5 text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800 cursor-pointer hover:bg-green-100">
                    {ing.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 各自独有 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">🔵 「{left?.product.name}」独有（{comparison.leftOnly.length}种）</h3>
              <div className="flex flex-wrap gap-1">
                {comparison.leftOnly.map(ing => (
                  <span key={ing.id} onClick={() => navigate(`/ingredient/${ing.id}`)}
                    className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100">
                    {ing.name} <span className="opacity-60">{ing.function}</span>
                  </span>
                ))}
                {comparison.leftOnly.length === 0 && <span className="text-xs text-gray-400">无独有成分</span>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">🟠 「{right?.product.name}」独有（{comparison.rightOnly.length}种）</h3>
              <div className="flex flex-wrap gap-1">
                {comparison.rightOnly.map(ing => (
                  <span key={ing.id} onClick={() => navigate(`/ingredient/${ing.id}`)}
                    className="px-2 py-0.5 text-xs bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full border border-orange-200 dark:border-orange-800 cursor-pointer hover:bg-orange-100">
                    {ing.name} <span className="opacity-60">{ing.function}</span>
                  </span>
                ))}
                {comparison.rightOnly.length === 0 && <span className="text-xs text-gray-400">无独有成分</span>}
              </div>
            </div>
          </div>

          {/* 结论 */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 text-sm">📋 综合结论</h3>
            <ul className="space-y-1.5">
              {comparison.conclusion.map((line, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300">{line}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 产品选择器弹窗 */}
      {picker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setPicker(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">选择产品</h3>
              <button onClick={() => setPicker(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <input type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="搜索产品..." aria-label="搜索产品进行对比"
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 outline-none mb-3 focus:border-purple-400" />
            <div className="overflow-y-auto flex-1 space-y-1">
              {products.slice(0, 25).map(p => (
                <button key={p.id} onClick={() => selectProduct(p.id, picker)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 flex items-center justify-between transition-colors">
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate block">{p.name}</span>
                    <span className="text-xs text-gray-400">{p.brand} · {productCategoryLabels[p.category]}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">¥{p.price || '?'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!picker && !left && !right && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <span className="text-5xl block mb-4">📊</span>
          <p className="text-lg font-medium mb-1">选择两个产品开始对比</p>
          <p className="text-sm">点击左右任意空白区域，从68款产品中选择</p>
        </div>
      )}
    </div>
  );
}
