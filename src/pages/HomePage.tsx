import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SearchBar } from '../components/common/SearchBar';
import { bestCleansers } from '../data/recommendations';

function getSavedSkinType(): string | null {
  try { return localStorage.getItem('user-skin-type'); } catch { return null; }
}

const skinEmoji: Record<string, string> = { '干性肌': '🏜️', '油性肌': '🛢️', '混合肌': '⚖️', '敏感肌': '🌹', '痘痘肌': '🔴', '中性肌': '✨' };

export function HomePage() {
  const navigate = useNavigate();
  const savedSkin = getSavedSkinType();
  useEffect(() => { document.title = '成分说明书 - 看懂你的护肤品'; }, []);

  return (
    <div>
      {/* Hero */}
      <section className="text-center px-4 pt-16 md:pt-24 pb-12 md:pb-16 bg-stone-50 dark:bg-neutral-950 border-b border-stone-200 dark:border-neutral-800">
        <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-4 font-medium">Skincare Ingredient Analyzer</p>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-stone-800 dark:text-stone-100 mb-4">看懂你的护肤品</h1>
        <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 max-w-md mx-auto mb-8 font-light leading-relaxed">
          成分表上的每一个名字都值得被理解。我们只说你能听懂的话。
        </p>
        <div className="max-w-md mx-auto">
          <SearchBar onSearch={(q: string) => navigate(`/search?q=${encodeURIComponent(q)}`)} placeholder="输入产品、品牌或成分..." large />
        </div>
        <div className="flex gap-3 justify-center mt-5 text-xs text-stone-400 dark:text-stone-500 flex-wrap">
          <span>烟酰胺</span><span>·</span><span>水杨酸</span><span>·</span><span>视黄醇</span><span>·</span><span>积雪草</span><span>·</span><span>神经酰胺</span>
        </div>
      </section>

      {/* Skin type bar */}
      {savedSkin && (
        <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm border border-stone-200 dark:border-neutral-800 flex items-center gap-3">
            <span className="text-2xl">{skinEmoji[savedSkin] || '✨'}</span>
            <div className="flex-1"><p className="text-sm font-medium text-stone-800 dark:text-stone-200">你的肤质：{savedSkin}</p><p className="text-xs text-stone-500">为你推荐适合{ savedSkin }的产品</p></div>
            <button onClick={() => navigate('/recommend')} className="px-4 py-2 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 text-sm font-medium rounded-full hover:opacity-80 transition-opacity">查看方案</button>
          </div>
        </div>
      )}

      {/* Navigation cards */}
      <section className={`max-w-4xl mx-auto px-4 ${savedSkin ? 'pt-8' : 'pt-12'} pb-12`}>
        <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-3 font-medium">Explore</p>
        <h2 className="text-xl md:text-2xl font-semibold text-stone-800 dark:text-stone-100 mb-1">探索</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 font-light">找到你需要的一切</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '⌘', title: '搜索产品', desc: '成分分析+风险评级', path: '/search' },
            { icon: '≡', title: '成分百科', desc: '100+种成分解释', path: '/ingredients' },
            { icon: '◈', title: '肤质测试', desc: 'MBTI风格诊断', path: '/recommend' },
            { icon: '◆', title: '编辑精选', desc: '宝藏产品推荐', path: '/explore' },
          ].map(c => (
            <button key={c.path} onClick={() => navigate(c.path)}
              className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-2xl p-5 text-left hover:border-stone-400 dark:hover:border-neutral-600 transition-all group">
              <span className="text-2xl text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300 mb-3 block">{c.icon}</span>
              <h3 className="font-medium text-stone-800 dark:text-stone-200 text-sm mb-1">{c.title}</h3>
              <p className="text-xs text-stone-500 dark:text-stone-500 font-light">{c.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Editor picks preview */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500 mb-2 font-medium">Editor's Picks</p>
            <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-100">编辑精选</h2>
          </div>
          <button onClick={() => navigate('/explore')} className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium">全部 →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {bestCleansers.slice(0, 3).map(pick => (
            <div key={pick.name} onClick={() => navigate('/search?q=' + encodeURIComponent(pick.name))}
              className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-2xl p-5 cursor-pointer hover:border-stone-400 dark:hover:border-neutral-600 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div><p className="font-medium text-stone-800 dark:text-stone-200 text-sm">{pick.name}</p><p className="text-xs text-stone-500 dark:text-stone-500 mt-0.5">{pick.brand} · {pick.priceCNY}</p></div>
                <span className="text-xs font-semibold text-amber-600">★ {pick.rating}</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-light">{pick.editorNote}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
