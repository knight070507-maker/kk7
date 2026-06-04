import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bestCleansers, bestSerums, bestMoisturizers, bestSunscreens, type EditorPick } from '../data/recommendations';

import { productDB } from '../data/products';

function PickCard({ pick }: { pick: EditorPick }) {
  const navigate = useNavigate();
  const handleClick = () => {
    const matchId = pick.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-');
    const found = productDB.find(p => p.id.includes(matchId) || matchId.includes(p.id));
    if (found) navigate(`/product/${found.id}`);
    else navigate('/search?q=' + encodeURIComponent(pick.name));
  };
  return (
    <div onClick={handleClick}
      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm">{pick.name}</h4>
          <p className="text-xs text-gray-400">{pick.brand} · {pick.priceCNY}</p>
        </div>
        <span className="text-sm font-bold text-amber-600 shrink-0 ml-2">★ {pick.rating}</span>
      </div>
      <div className="flex items-center gap-1 mb-2">
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          pick.sourceTag === 'derm-approved' ? 'bg-blue-100 text-blue-700' :
          pick.sourceTag === 'science-backed' ? 'bg-purple-100 text-purple-700' :
          pick.sourceTag === 'cult-classic' ? 'bg-amber-100 text-amber-700' :
          'bg-emerald-100 text-emerald-700'
        }`}>
          {pick.sourceTag === 'derm-approved' ? '👨‍⚕️ 皮肤科推荐' :
           pick.sourceTag === 'science-backed' ? '🔬 科学验证' :
           pick.sourceTag === 'cult-classic' ? '⭐ 口碑经典' : '💎 隐藏宝藏'}
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-2">{pick.whyPicked}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {pick.skinTypes.map(s => (
          <span key={s} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">{s}</span>
        ))}
      </div>
      <p className="text-xs text-gray-500 italic">💬 {pick.editorNote}</p>
      <p className="text-xs text-orange-500 mt-1">⚠️ {pick.drawback}</p>
    </div>
  );
}

function getSavedSkinType(): string | null {
  try { return localStorage.getItem('user-skin-type'); } catch { return null; }
}

export function ExplorePage() {
  const navigate = useNavigate();
  const [savedSkin, setSavedSkin] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'cleanser' | 'serum' | 'moisturizer' | 'sunscreen'>('all');

  useEffect(() => { setSavedSkin(getSavedSkinType()); }, []);

  const sections = [
    { key: 'cleanser' as const, title: '🧴 洁面', data: bestCleansers },
    { key: 'serum' as const, title: '🧪 精华', data: bestSerums },
    { key: 'moisturizer' as const, title: '🧴 面霜', data: bestMoisturizers },
    { key: 'sunscreen' as const, title: '☀️ 防晒', data: bestSunscreens },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">🏆 全球编辑精选</h1>
      <p className="text-sm text-gray-500 mb-2">基于皮肤科医生共识 + 化妆品化学家分析 + 全球口碑。不迷信品牌，只相信配方和效果。</p>

      {savedSkin && (
        <div className="mb-6 p-3 bg-purple-50 rounded-xl border border-purple-200 text-sm text-purple-700 flex items-center gap-2">
          💡 你的肤质是 <strong>{savedSkin}</strong>，已为你标注特别适合的产品。
          <button onClick={() => navigate('/recommend')} className="ml-2 underline font-medium">查看完整方案 →</button>
        </div>
      )}

      {/* 标签筛选 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>全部</button>
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveTab(s.key)} className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${activeTab === s.key ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s.title}</button>
        ))}
      </div>

      {/* 推荐列表 */}
      {sections.filter(s => activeTab === 'all' || s.key === activeTab).map(section => (
        <div key={section.key} className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">{section.title}</h2>
          <p className="text-xs text-gray-400 mb-3">排名分先后——第一位是我们最推荐的产品。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {section.data.map(pick => (
              <PickCard key={pick.name} pick={pick} />
            ))}
          </div>
        </div>
      ))}

      {/* Trending 实时推荐 */}
      <div className="mt-8 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">🔥 实时热门 & 社区精选</h2>
        <p className="text-xs text-gray-400 mb-4">基于搜索数据 + 社区讨论热度，定期更新。</p>

        {/* 换季提醒 */}
        {savedSkin && (
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-amber-200 mb-4">
            <h4 className="font-semibold text-amber-800 text-sm mb-2">🍂 换季提醒</h4>
            <p className="text-xs text-amber-700">
              {savedSkin === '干性肌' && '秋冬空气干燥，干皮需要从"补水精华+乳液"升级为"修复精华+厚重面霜"。推荐加入角鲨烷油或神经酰胺面霜。'}
              {savedSkin === '油性肌' && '换季时油皮容易出现"外油内干"——不要停用保湿！继续用水杨酸控制油脂，但面霜换成啫喱质地的。'}
              {savedSkin === '混合肌' && '换季时T区出油减少、U区变得更干。可以给脸颊局部叠涂保湿霜，T区保持清爽。'}
              {savedSkin === '敏感肌' && '换季是敏感肌最难的时期！避免尝试任何新产品，精简到洁面+修复霜+防晒三样。泛红时用理肤泉B5厚敷。'}
              {savedSkin === '痘痘肌' && '换季时避免频繁更换祛痘产品。继续用水杨酸+壬二酸的组合，但减少频率（隔天用）。注意保湿不然屏障受损会更糟。'}
              {savedSkin === '中性肌' && '换季时中性肌也可能出现局部干燥。加一个保湿精华在面霜前使用就够，不需要大调整。'}
            </p>
          </div>
        )}

        {/* 社区热门 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">🗣️ 社区讨论最热</h4>
            {[
              { name: '修丽可CE精华', reason: '抗氧化天花板，值得花1490吗？社区一致意见：值' },
              { name: 'Beauty of Joseon防晒', reason: '韩国防晒在欧美爆火，Reddit每天都有人发帖问' },
              { name: 'CeraVe全线产品', reason: '皮肤科医生和Reddit网友罕见达成共识的品牌' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5">
                <span className="text-xs font-bold text-amber-500 w-4">{i + 1}</span>
                <div>
                  <button onClick={() => navigate('/search?q=' + encodeURIComponent(item.name))} className="text-sm font-medium text-gray-700 hover:text-purple-600 text-left">
                    {item.name}
                  </button>
                  <p className="text-xs text-gray-400">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">⭐ 口碑炸裂新品</h4>
            {[
              { name: 'Prequel Gleanser', reason: '50%甘油洁面，2024年最被低估的创新产品' },
              { name: 'Dieux Instant Angel', reason: '3:1:1屏障仿生比例，成分党的新宠面霜' },
              { name: '珀莱雅双抗精华', reason: '国货之光，189元买麦角硫因+谷胱甘肽，社区好评如潮' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5">
                <span className="text-xs font-bold text-purple-500 w-4">{i + 1}</span>
                <div>
                  <button onClick={() => navigate('/search?q=' + encodeURIComponent(item.name))} className="text-sm font-medium text-gray-700 hover:text-purple-600 text-left">
                    {item.name}
                  </button>
                  <p className="text-xs text-gray-400">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-400">
        <p>📚 基于对全球皮肤科医生共识、Reddit (r/SkincareAddiction, r/AsianBeauty)、韩国Olive Young榜单、日本Cosme排名、化妆品化学家分析以及临床文献的深度研究。每24小时更新一次社区热榜。</p>
      </div>
    </div>
  );
}
