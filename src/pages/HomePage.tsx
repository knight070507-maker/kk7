import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SearchBar } from '../components/common/SearchBar';
import { bestCleansers } from '../data/recommendations';

// 持久化肤质
function getSavedSkinType(): string | null {
  try { return localStorage.getItem('user-skin-type'); } catch { return null; }
}

const navCards = [
  { icon: '🔍', title: '搜索产品成分', desc: '输入任何护肤品，查看完整成分分析和风险评级', path: '/search', color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50' },
  { icon: '🧪', title: '成分百科', desc: '100+种常见成分，用最简单的中文解释每种成分的作用', path: '/ingredients', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50' },
  { icon: '🧬', title: '肤质测试推荐', desc: '选你的肤质，获取皮肤科医生验证的护肤方案', path: '/recommend', color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50' },
  { icon: '🏆', title: '全球编辑精选', desc: '基于深度研究的宝藏产品推荐，不分贵贱只分好坏', path: '/explore', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
];

export function HomePage() {
  const navigate = useNavigate();
  const [savedSkin, setSavedSkin] = useState<string | null>(null);

  useEffect(() => { setSavedSkin(getSavedSkinType()); }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-500 via-purple-400 to-pink-400 text-white">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">🧴 看懂你的护肤品</h1>
          <p className="text-sm md:text-lg text-purple-100 mb-6 max-w-xl mx-auto">
            用最简单的话，帮你看懂每一种护肤成分。再也不被成分表上的"天书"困扰。
          </p>
          <SearchBar onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} placeholder="搜产品、品牌或成分..." large />
          <p className="text-xs text-purple-200 mt-3">烟酰胺 · 水杨酸 · 视黄醇 · 积雪草 · 神经酰胺</p>
        </div>
      </section>

      {/* 肤质个性化提示 */}
      {savedSkin && (
        <section className="max-w-3xl mx-auto px-4 -mt-5 relative z-10">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-purple-200 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{savedSkin === '干性肌' ? '🏜️' : savedSkin === '油性肌' ? '🛢️' : savedSkin === '混合肌' ? '⚖️' : savedSkin === '敏感肌' ? '🌹' : savedSkin === '痘痘肌' ? '🔴' : '✨'}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">你的肤质：{savedSkin}</p>
                <p className="text-xs text-gray-400">为你推荐适合{ savedSkin }的产品</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/recommend')} className="px-4 py-2 bg-purple-500 text-white text-sm font-medium rounded-xl hover:bg-purple-600 transition-colors">
                查看护肤方案
              </button>
              <button onClick={() => { localStorage.removeItem('user-skin-type'); setSavedSkin(null); }} className="px-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                重新测试
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 功能导航卡片 */}
      <section className={`max-w-4xl mx-auto px-4 ${savedSkin ? 'pt-6' : 'pt-10'} pb-8`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {navCards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className={`${card.bg} rounded-2xl p-4 md:p-5 text-left hover:shadow-lg transition-all border border-transparent hover:border-purple-200`}
            >
              <span className="text-3xl md:text-4xl block mb-2">{card.icon}</span>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-1">{card.title}</h3>
              <p className="text-xs text-gray-500 hidden md:block">{card.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 快速推荐：编辑精选（精简版） */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">🏆 编辑精选</h2>
          <button onClick={() => navigate('/explore')} className="text-sm text-purple-600 font-medium">查看全部 →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {bestCleansers.slice(0, 3).map((pick) => (
            <div key={pick.name} onClick={() => navigate('/search?q=' + encodeURIComponent(pick.name))} className="p-3 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow cursor-pointer transition-all">
              <div className="flex items-start justify-between mb-1">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{pick.name}</p>
                  <p className="text-xs text-gray-400">{pick.brand} · {pick.priceCNY}</p>
                </div>
                <span className="text-xs font-bold text-amber-600 shrink-0">★ {pick.rating}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{pick.editorNote}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
