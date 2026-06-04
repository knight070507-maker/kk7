import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import { SearchBar } from '../components/common/SearchBar';
import { ProductCard } from '../components/product/ProductCard';
import { IngredientCard } from '../components/ingredient/IngredientCard';
import { productDB } from '../data/products';
import { allIngredients } from '../data/ingredients';
import { analyzeProduct } from '../utils/analysis';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { RiskBadge } from '../components/common/RiskBadge';
import { trackSearch } from '../hooks/useAnalytics';

interface AIResult {
  _notFound?: boolean;
  message?: string;
  suggestions?: string[];
  productName?: string;
  brand?: string;
  category?: string;
  summary?: string;
  suitableFor?: string[];
  targets?: string[];
  pros?: string[];
  cons?: string[];
  priceTier?: string;
  valueRating?: string;
  valueNote?: string;
  overallRating?: string;
  harmfulCount?: number;
  irritantCount?: number;
  comedogenicCount?: number;
  ingredients?: {
    name: string;
    nameEn: string;
    riskLevel: number;
    isIrritant: boolean;
    isComedogenic: boolean;
    function: string;
    simpleExplanation: string;
  }[];
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { user } = useAuth();

  // AI 搜索状态
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiError, setAiError] = useState('');

  const handleSearch = (q: string) => {
    setAiResult(null);
    setAiError('');
    setSearchParams({ q });
  };

  const localResults = useMemo(() => {
    if (!query.trim()) return { products: [], ingredients: [], hasResults: false };
    const q = query.toLowerCase();
    const matchedProducts = productDB.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || (p.summary && p.summary.toLowerCase().includes(q))
    ).map((p) => ({ product: p, analysis: analyzeProduct(p) }));
    const matchedIngredients = allIngredients.filter(
      (ing) => ing.name.toLowerCase().includes(q) || ing.nameEn.toLowerCase().includes(q) || ing.aliases.some((a) => a.toLowerCase().includes(q)) || ing.function.toLowerCase().includes(q) || ing.tags.some((t) => t.toLowerCase().includes(q))
    );
    return { products: matchedProducts, ingredients: matchedIngredients, hasResults: matchedProducts.length > 0 || matchedIngredients.length > 0 };
  }, [query]);

  // 跟踪所有搜索（每当 query 变化时）
  useEffect(() => {
    if (!query || query.trim().length < 2) return;
    trackSearch(query.trim(), 'local', localResults.hasResults, user?.id);
    if (user) {
      supabase.from('search_history').insert({
        user_id: user.id,
        query: query.trim(),
        is_ai_result: false,
        result_count: localResults.products.length + localResults.ingredients.length,
      });
    }
  }, [query]); // 只要 query 变化就触发
  const runAIAnalysis = async () => {
    if (!query.trim()) return;
    setAiLoading(true);
    setAiError('');

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      // 先读取文本，再尝试解析JSON
      const text = await res.text();

      if (!text || text.trim().length === 0) {
        throw new Error('服务器返回了空响应，可能是 AI 接口超时，请重试');
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        // 如果返回的是 HTML 错误页或非 JSON
        if (text.includes('<html') || text.includes('<!DOCTYPE')) {
          throw new Error('服务器错误，请稍后重试');
        }
        throw new Error('AI 返回格式异常：' + text.substring(0, 100));
      }

      if (!res.ok) {
        throw new Error(data.error || '分析失败，请重试');
      }

      // 产品不存在，显示建议
      if (data.exists === false) {
        setAiResult({ _notFound: true, message: data.message, suggestions: data.suggestions } as any);
        return;
      }

      if (!data.productName || data.productName === '信息暂缺') {
        throw new Error('AI 暂时无法识别这个产品，请尝试输入更完整的产品名称（包含品牌名）');
      }

      setAiResult(data as AIResult);
      trackSearch(query, 'ai', true, user?.id);

      // 缓存到 Supabase（如果用户登录了）
      if (user) {
        supabase.from('analysis_cache').upsert({
          query: query.trim(),
          product_data: data,
          ingredients: data.ingredients,
          analysis: { overallRating: data.overallRating, harmfulCount: data.harmfulCount, irritantCount: data.irritantCount, comedogenicCount: data.comedogenicCount },
        }, { onConflict: 'query' });
      }
    } catch (e: any) {
      setAiError(e.message || 'AI 分析暂时不可用');
      trackSearch(query, 'ai', false, user?.id);
    } finally {
      setAiLoading(false);
    }
  };

  const getValueLabel = (rating: string) => {
    const map: Record<string, string> = { 'great-value': '平民好物', 'fair': '物有所值', 'overpriced': '品牌溢价', 'not-worth-it': '不值得买' };
    return map[rating] || rating;
  };

  const getTierLabel = (tier: string) => {
    const map: Record<string, string> = { 'budget': '💰 平价', 'mid': '💰💰 中端', 'premium': '💰💰💰 高端', 'luxury': '💰💰💰💰 奢侈' };
    return map[tier] || tier;
  };

  const getRatingBg = (rating: string) => {
    if (rating === 'warning') return 'bg-red-50 border-red-200';
    if (rating === 'caution') return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getRatingText = (rating: string) => {
    if (rating === 'warning') return '建议避开';
    if (rating === 'caution') return '谨慎选择';
    return '安心使用';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🔍 搜索</h1>
      <SearchBar onSearch={handleSearch} initialValue={query} placeholder="输入产品名称、品牌或成分名称..." />

      {query && (
        <div className="mt-4 text-gray-500 text-sm">搜索 "{query}" 的结果</div>
      )}

      <div className="mt-8">
        {/* 本地产品结果 */}
        {localResults.products.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📦 数据库中已有（{localResults.products.length}）</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localResults.products.map(({ product, analysis }) => (
                <ProductCard key={product.id} product={product} analysis={analysis} />
              ))}
            </div>
          </section>
        )}

        {/* 成分结果 */}
        {localResults.ingredients.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🧪 相关成分（{localResults.ingredients.length}）</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {localResults.ingredients.map((ing) => (
                <IngredientCard key={ing.id} ingredient={ing} />
              ))}
            </div>
          </section>
        )}

        {/* AI 搜索区域 */}
        {query && !localResults.hasResults && !aiResult && !aiLoading && (
          <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
            <span className="text-6xl">🤖</span>
            <p className="mt-4 text-xl font-medium text-gray-700">数据库里还没有「{query}」</p>
            <p className="mt-2 text-gray-500">让我用 AI 实时上网搜索这个产品的成分，马上给你分析结果</p>
            <button
              onClick={runAIAnalysis}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              🚀 AI 实时分析「{query}」
            </button>
            <p className="mt-3 text-xs text-gray-400">AI 会上网查找成分表并生成分析，耗时约 3-5 秒</p>
          </div>
        )}

        {/* AI 加载中 */}
        {aiLoading && (
          <div className="text-center py-16">
            <div className="inline-block w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
            <p className="mt-6 text-lg font-medium text-gray-700">🤖 AI 正在分析「{query}」...</p>
            <p className="mt-2 text-sm text-gray-400">正在搜索产品成分表 → 分析每种成分 → 生成报告</p>
          </div>
        )}

        {/* AI 错误 */}
        {aiError && (
          <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
            <span className="text-5xl">😕</span>
            <p className="mt-4 text-lg text-red-600">{aiError}</p>
            <button onClick={runAIAnalysis} className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium">
              🔄 重试
            </button>
          </div>
        )}

        {/* AI 未找到产品 — 显示建议 */}
        {aiResult && aiResult._notFound && (
          <div className="text-center py-8 bg-amber-50 rounded-2xl border-2 border-amber-200">
            <span className="text-5xl">🤔</span>
            <p className="mt-4 text-lg font-medium text-gray-700">{aiResult.message || '没有找到这个产品'}</p>
            {aiResult.suggestions && aiResult.suggestions.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3">👇 点击以下产品查看分析：</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {aiResult.suggestions.map((s: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => { setAiResult(null); setSearchParams({ q: s }); }}
                      className="px-5 py-2.5 bg-white border-2 border-amber-300 text-gray-700 font-medium rounded-xl hover:bg-amber-50 hover:border-amber-400 transition-all shadow-sm"
                    >
                      🔍 {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI 分析结果 */}
        {aiResult && !aiResult._notFound && (() => {
          const r = aiResult as Required<AIResult>;
          return (<section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">🤖 AI 分析</span>
              <h2 className="text-lg font-semibold text-gray-800">{r.productName}</h2>
              <span className="text-xs text-gray-400">{r.brand}</span>
            </div>

            {/* 产品卡片 */}
            <div className={`p-5 rounded-2xl border-2 mb-6 ${getRatingBg(r.overallRating!)}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 text-xs bg-white rounded-full border font-medium">{r.category}</span>
                <span className="text-xs text-gray-400">{getTierLabel(r.priceTier!)}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${r.valueRating === 'great-value' ? 'bg-green-100 text-green-700 border-green-300' : r.valueRating === 'overpriced' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-blue-100 text-blue-700 border-blue-300'}`}>
                  {getValueLabel(r.valueRating!)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">💬 {r.summary}</p>
              <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                <span>🔴 <span className="font-medium">{r.harmfulCount}</span> 有害</span>
                <span>🟡 <span className="font-medium">{r.irritantCount}</span> 刺激</span>
                <span>⚪ <span className="font-medium">{r.comedogenicCount}</span> 致痘</span>
              </div>
              <div className={`text-sm font-bold ${r.overallRating === 'warning' ? 'text-red-600' : r.overallRating === 'caution' ? 'text-yellow-600' : 'text-green-600'}`}>
                {getRatingText(r.overallRating!)}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {r.pros && r.pros.length > 0 && (
                <div className="p-4 bg-white rounded-xl border border-emerald-200">
                  <h4 className="text-sm font-semibold text-emerald-700 mb-2">👍 优点</h4>
                  <ul className="space-y-1">{r.pros.map((p, i) => (<li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> {p}</li>))}</ul>
                </div>
              )}
              {r.cons && r.cons.length > 0 && (
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <h4 className="text-sm font-semibold text-orange-700 mb-2">👎 缺点</h4>
                  <ul className="space-y-1">{r.cons.map((c, i) => (<li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-orange-400 mt-0.5">•</span> {c}</li>))}</ul>
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">📋 AI 分析的成分列表</h3>
              <div className="space-y-2">
                {r.ingredients!.map((ing, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <span className="text-xs text-gray-400 w-5 text-center mt-0.5">{idx + 1}</span>
                    <div className={`w-1.5 h-8 rounded-full shrink-0 mt-0.5 ${ing.riskLevel === 0 ? 'bg-green-400' : ing.riskLevel === 1 ? 'bg-yellow-400' : ing.riskLevel === 2 ? 'bg-orange-400' : 'bg-red-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 text-sm cursor-pointer hover:text-purple-600 underline decoration-dotted" onClick={() => navigate(`/search?q=${encodeURIComponent(ing.name)}`)}>{ing.name}</span>
                        <span className="text-xs text-gray-400 hidden sm:inline">{ing.nameEn}</span>
                        <RiskBadge level={ing.riskLevel as any} size="sm" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{ing.simpleExplanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-xs text-center text-gray-400">🤖 以上内容由 AI 生成，仅供参考。建议核实产品官方成分表。</p>
          </section>);
        })()}

        {/* 无查询提示 */}
        {!query && (
          <div className="text-center py-12">
            <span className="text-6xl">🔍</span>
            <p className="mt-4 text-lg text-gray-500">输入产品名称开始搜索</p>
            <p className="mt-2 text-sm text-gray-400">
              数据库中有 68 款热门产品。找不到的？AI 会实时上网搜索分析！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
