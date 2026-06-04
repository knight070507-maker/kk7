import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Stats {
  todayVisits: number;
  totalVisits: number;
  todaySearches: number;
  totalSearches: number;
  aiCalls: number;
  aiSuccessRate: number;
  topSearches: { query: string; count: number }[];
  recentSearches: { query: string; source: string; created_at: string }[];
  pageViews: { page: string; count: number }[];
}

export function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      // 今日访问
      const { count: todayVisits } = await supabase
        .from('analytics_pageviews')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // 总访问
      const { count: totalVisits } = await supabase
        .from('analytics_pageviews')
        .select('*', { count: 'exact', head: true });

      // 今日搜索
      const { count: todaySearches } = await supabase
        .from('analytics_searches')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // 总搜索
      const { count: totalSearches } = await supabase
        .from('analytics_searches')
        .select('*', { count: 'exact', head: true });

      // AI 调用
      const { count: aiCalls } = await supabase
        .from('analytics_searches')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'ai');

      const { count: aiSuccess } = await supabase
        .from('analytics_searches')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'ai')
        .eq('success', true);

      // 热门搜索
      const { data: topSearches } = await supabase
        .from('analytics_searches')
        .select('query')
        .order('created_at', { ascending: false })
        .limit(200);

      // 最近搜索
      const { data: recentSearches } = await supabase
        .from('analytics_searches')
        .select('query, source, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      // 页面访问
      const { data: pageViews } = await supabase
        .from('analytics_pageviews')
        .select('page')
        .order('created_at', { ascending: false })
        .limit(500);

      // 统计热门搜索词
      const searchCounts: Record<string, number> = {};
      (topSearches || []).forEach(s => {
        const q = s.query.toLowerCase().trim();
        searchCounts[q] = (searchCounts[q] || 0) + 1;
      });
      const sortedSearches = Object.entries(searchCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([query, count]) => ({ query, count }));

      // 统计页面访问
      const pageCounts: Record<string, number> = {};
      (pageViews || []).forEach(p => {
        const page = p.page || '/';
        pageCounts[page] = (pageCounts[page] || 0) + 1;
      });
      const sortedPages = Object.entries(pageCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([page, count]) => ({ page, count }));

      setStats({
        todayVisits: todayVisits || 0,
        totalVisits: totalVisits || 0,
        todaySearches: todaySearches || 0,
        totalSearches: totalSearches || 0,
        aiCalls: aiCalls || 0,
        aiSuccessRate: aiCalls ? Math.round(((aiSuccess || 0) / aiCalls) * 100) : 100,
        topSearches: sortedSearches,
        recentSearches: (recentSearches || []).map(r => ({
          ...r,
          created_at: new Date(r.created_at).toLocaleString('zh-CN'),
        })),
        pageViews: sortedPages,
      });
    } catch (e) {
      console.error('Stats error:', e);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
      <p className="mt-4 text-gray-500">加载统计数据...</p>
    </div>
  );

  if (!stats) return <div className="text-center py-16 text-gray-400">无法加载统计数据</div>;

  const pageName = (p: string) => {
    const map: Record<string, string> = { '/': '首页', '/search': '搜索页', '/ingredients': '成分百科', '/request': '申请分析' };
    return map[p] || (p.startsWith('/product/') ? '产品详情' : p.startsWith('/ingredient/') ? '成分详情' : p);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📊 网站统计数据</h1>
        <button onClick={loadStats} className="px-4 py-2 text-sm bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors">
          🔄 刷新
        </button>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '👀', label: '今日访问', value: stats.todayVisits, sub: `总计 ${stats.totalVisits}` },
          { icon: '🔍', label: '今日搜索', value: stats.todaySearches, sub: `总计 ${stats.totalSearches}` },
          { icon: '🤖', label: 'AI 分析', value: stats.aiCalls, sub: `成功率 ${stats.aiSuccessRate}%` },
          { icon: '📄', label: '页面浏览', value: stats.totalVisits, sub: '全部页面' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="text-xl">{card.icon}</span> {card.label}
            </div>
            <div className="text-3xl font-bold text-gray-800">{card.value}</div>
            <div className="text-xs text-gray-400 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 热门搜索词 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">🔥 热门搜索词 Top 10</h3>
          {stats.topSearches.length === 0 ? (
            <p className="text-sm text-gray-400">暂无数据</p>
          ) : (
            <div className="space-y-2">
              {stats.topSearches.map((s, i) => (
                <div key={s.query} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all"
                      style={{ width: `${Math.max((s.count / stats.topSearches[0].count) * 100, 8)}%` }}
                    />
                    <span className="absolute inset-0 flex items-center px-3 text-xs text-gray-700 font-medium">
                      {s.query}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 页面访问分布 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">📄 页面访问量</h3>
          {stats.pageViews.length === 0 ? (
            <p className="text-sm text-gray-400">暂无数据</p>
          ) : (
            <div className="space-y-3">
              {stats.pageViews.map((p) => (
                <div key={p.page} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20">{pageName(p.page)}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                      style={{ width: `${Math.max((p.count / stats.pageViews[0].count) * 100, 10)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8 text-right">{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 最近搜索 */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">🕐 最近20条搜索</h3>
        {stats.recentSearches.length === 0 ? (
          <p className="text-sm text-gray-400">暂无搜索记录</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="pb-2 font-medium">搜索词</th>
                  <th className="pb-2 font-medium">来源</th>
                  <th className="pb-2 font-medium">时间</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSearches.map((s, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700">🔍 {s.query}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${s.source === 'ai' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {s.source === 'ai' ? '🤖 AI' : '📦 本地'}
                      </span>
                    </td>
                    <td className="py-2 text-gray-400 text-xs">{s.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
