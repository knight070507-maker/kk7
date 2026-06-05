import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { skinTypeRecommendations, type EditorPick } from '../data/recommendations';

// ====== MBTI 风格肤质测试 ======
interface Question {
  id: number;
  question: string;
  emoji: string;
  illustration: string; // 示意图描述
  options: { label: string; text: string; scores: Record<string, number> }[];
}

const questions: Question[] = [
  {
    id: 1, question: '洗脸30分钟后，什么都不涂，你的脸感觉？',
    emoji: '🧼',
    illustration: '正常皮肤洗完脸后，皮脂膜会在30分钟内恢复。通过这个测试可以判断你的皮脂分泌水平。',
    options: [
      { label: 'A', text: '紧绷、起皮、笑起来有干纹', scores: { dry: 3, sensitive: 1 } },
      { label: 'B', text: '全脸都是油光，手指一摸亮晶晶', scores: { oily: 3 } },
      { label: 'C', text: '额头鼻子油、脸颊嘴角干', scores: { combo: 3 } },
      { label: 'D', text: '不油不干，触感柔软舒适', scores: { normal: 3 } },
      { label: 'E', text: '发红、发热、有刺痛感', scores: { sensitive: 3 } },
    ],
  },
  {
    id: 2, question: '你的毛孔看起来怎么样？',
    emoji: '🔍',
    illustration: '毛孔大小和分布是判断肤质的重要线索。对着镜子在自然光下观察鼻子和脸颊。',
    options: [
      { label: 'A', text: '几乎看不见毛孔，皮肤细腻', scores: { normal: 2, dry: 1 } },
      { label: 'B', text: 'T区毛孔明显像橘子皮，脸颊还好', scores: { combo: 3, oily: 1 } },
      { label: 'C', text: '全脸毛孔都很粗大明显', scores: { oily: 3 } },
      { label: 'D', text: '毛孔堵塞，有很多黑头白头', scores: { acne: 3, oily: 1 } },
    ],
  },
  {
    id: 3, question: '长痘痘/粉刺的频率是？',
    emoji: '🔴',
    illustration: '痘痘的成因很复杂——油脂分泌、细菌、角质堵塞、炎症都可能是元凶。',
    options: [
      { label: 'A', text: '几乎从不长痘，皮肤很省心', scores: { normal: 2, dry: 1 } },
      { label: 'B', text: '偶尔姨妈期/熬夜后冒一两颗', scores: { combo: 2 } },
      { label: 'C', text: '经常反复长痘，旧的刚好新的又来', scores: { acne: 3, oily: 1 } },
      { label: 'D', text: '大面积囊肿型痘痘，又红又疼', scores: { acne: 4, sensitive: 1 } },
    ],
  },
  {
    id: 4, question: '尝试新护肤品时，皮肤的反应是？',
    emoji: '🧪',
    illustration: '皮肤屏障的健康程度决定了你的"耐受性"。屏障受损的皮肤对外界刺激反应更大。',
    options: [
      { label: 'A', text: '基本上什么都能用，从不过敏', scores: { normal: 3 } },
      { label: 'B', text: '偶尔有刺热感但很快就消失', scores: { combo: 1, oily: 1 } },
      { label: 'C', text: '经常会泛红、发痒、起小疹子', scores: { sensitive: 3 } },
      { label: 'D', text: '超级容易过敏，只能用品类很少', scores: { sensitive: 4 } },
    ],
  },
  {
    id: 5, question: '到了下午/傍晚，你的脸通常？',
    emoji: '🕐',
    illustration: '皮脂腺在一天中的活跃度会变化。下午是观察皮肤出油情况的好时机。',
    options: [
      { label: 'A', text: '越来越干，笑的时候眼角有干纹', scores: { dry: 3 } },
      { label: 'B', text: '油光满面，用吸油纸能吸透两张', scores: { oily: 3 } },
      { label: 'C', text: 'T区泛油光、U区正常或偏干', scores: { combo: 3 } },
      { label: 'D', text: '和早上差不多，没什么变化', scores: { normal: 2 } },
    ],
  },
  {
    id: 6, question: '你现在最想改善的皮肤问题是什么？（可多选）',
    emoji: '🎯',
    illustration: '不同的问题需要不同的成分来攻克。明确你的优先级，才能找到最有效的产品。',
    options: [
      { label: 'A', text: '干燥起皮、细纹明显', scores: { dry: 2 } },
      { label: 'B', text: '出油旺盛、毛孔粗大', scores: { oily: 2 } },
      { label: 'C', text: '痘痘反反复复、痘印不消', scores: { acne: 2 } },
      { label: 'D', text: '泛红敏感、动不动就过敏', scores: { sensitive: 2 } },
      { label: 'E', text: '肤色暗沉发黄、不均匀', scores: { normal: 1, combo: 1 } },
      { label: 'F', text: '皮肤松弛、法令纹加深', scores: { normal: 1, dry: 1 } },
    ],
  },
  {
    id: 7, question: '你居住的环境和季节是？',
    emoji: '🌍',
    illustration: '环境湿度、温度、紫外线强度直接影响皮肤状态。同样的肤质在不同环境下需求不同。',
    options: [
      { label: 'A', text: '干燥地区/冬天——皮肤明显更干', scores: { dry: 2 } },
      { label: 'B', text: '潮湿地区/夏天——皮肤出油更多', scores: { oily: 2 } },
      { label: 'C', text: '四季分明——换季时皮肤最不稳定', scores: { sensitive: 1, combo: 1 } },
      { label: 'D', text: '不太受环境影响，皮肤很稳定', scores: { normal: 2 } },
    ],
  },
];

type SkinResultType = '干性肌' | '油性肌' | '混合肌' | '敏感肌' | '痘痘肌' | '中性肌';

const resultInfo: Record<SkinResultType, { emoji: string; title: string; subtitle: string; desc: string; tips: string[] }> = {
  '干性肌': {
    emoji: '🏜️', title: '干性肌肤', subtitle: 'The Desert Skin — 缺水也缺油',
    desc: '你的皮脂腺不太活跃，分泌的天然油脂不够多。这意味着你的皮肤屏障天生偏薄，锁水能力差。好消息是你不容易长痘，毛孔也细腻；坏消息是细纹和干纹会来得更早。你的护肤关键词是「补水 + 锁水 + 修护屏障」。',
    tips: ['选择氨基酸/APG洁面，远离皂基和SLS', '精华选含神经酰胺、角鲨烷、泛醇的修复型', '面霜选含乳木果油、凡士林的封闭型', '冬天可以考虑加一个护肤油'],
  },
  '油性肌': {
    emoji: '🛢️', title: '油性肌肤', subtitle: 'The Active Gland Skin — 油井需要管理不是关闭',
    desc: '你的皮脂腺非常活跃，雄激素受体敏感，导致油脂分泌旺盛。很多人觉得"油皮=要疯狂清洁"——这是最大的误区。过度清洁会让皮肤更油。你的护肤关键词是「温和清洁 + 控油不脱水 + 疏通毛孔」。',
    tips: ['水杨酸(BHA)是你的好朋友——能深入毛孔溶解油脂', '烟酰胺+PCA锌能有效调节油脂分泌', '用啫喱/凝胶质地的保湿品，不要怕涂保湿', '定期用泥膜吸附多余油脂（一周1-2次）'],
  },
  '混合肌': {
    emoji: '⚖️', title: '混合性肌肤', subtitle: 'The Combo Skin — 两个人的脸长在一起',
    desc: '你有两种肤质——T区（额头鼻子下巴）偏油、U区（脸颊眼周）偏干。这说明你的皮脂腺分布不均匀。护肤时不需要"分区涂两套产品"，选对成分可以让全脸平衡。你的护肤关键词是「T区控油 + U区保湿 + 整体平衡」。',
    tips: ['烟酰胺可以同时控油和保湿，是混合肌的理想成分', '水杨酸只涂T区（额头、鼻子、下巴）', '选质地轻盈的乳液，不要用太厚重的霜', 'U区干的时候可以叠加一点点角鲨烷油'],
  },
  '敏感肌': {
    emoji: '🌹', title: '敏感性肌肤', subtitle: 'The Reactive Skin — 皮肤屏障在求救',
    desc: '你的皮肤屏障功能偏弱，对外界刺激（酒精、香精、温度变化）反应大。这可能是天生的，也可能是后天"作"出来的（过度清洁、频繁刷酸）。你的护肤关键词是「精简 + 修护 + 避开刺激」。少即是多——3-4样产品就够。',
    tips: ['洁面只用最温和的（Vanicream、氨基酸表活）', '核心成分：积雪草、神经酰胺、泛醇、甘草酸二钾', '绝对远离酒精、香精、精油、MIT防腐剂', '新产品先在耳后测试24小时，不过敏再上脸'],
  },
  '痘痘肌': {
    emoji: '🔴', title: '痘痘肌/痤疮倾向', subtitle: 'The Acne-Prone Skin — 不只是"青春期的问题"',
    desc: '你的皮肤反复出现痘痘、粉刺、闭口。根本原因是：油脂过多 + 毛孔堵塞 + 痤疮杆菌增生 + 炎症反应。很多人疯狂用祛痘产品导致屏障受损，反而更严重。你的护肤关键词是「疏通 + 抗炎 + 温和 + 坚持」。',
    tips: ['水杨酸(BHA)疏通毛孔、壬二酸抗炎淡痘印', '不要挤痘痘——会留永久性痘坑', '防晒非常重要！紫外线会让痘印变深', '如果长期大面积长痘，一定要看皮肤科医生'],
  },
  '中性肌': {
    emoji: '✨', title: '中性肌肤', subtitle: 'The Blessed Skin — 天选之皮',
    desc: '恭喜你！你的皮肤水油平衡、毛孔细腻、不易敏感——这是所有人都羡慕的状态。但"中性"不是永远不变的，随着年龄增长和环境变化，肤质也可能改变。你的护肤关键词是「维持 + 抗氧化 + 防晒」。',
    tips: ['不需要复杂的护肤流程，做好基础就够', '投资一个好的抗氧化精华（VC+VE+阿魏酸）', '防晒是保持中性肌的秘诀——每天都要涂', '不要因为皮肤好就随便乱试产品'],
  },
};

export function RecommendPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'quiz' | 'result'>('quiz');
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [multiSelect, setMultiSelect] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<SkinResultType | null>(null);
  const savedSkin = (() => { try { return localStorage.getItem('user-skin-type'); } catch { return null; } })();

  const computeResult = (finalScores: Record<string, number>) => {
    const sorted = Object.entries(finalScores).sort(([, a], [, b]) => b - a);
    const map: Record<string, SkinResultType> = { dry: '干性肌', oily: '油性肌', combo: '混合肌', sensitive: '敏感肌', acne: '痘痘肌', normal: '中性肌' };
    const skinResult = map[sorted[0]?.[0]] || '中性肌';
    setResult(skinResult);
    localStorage.setItem('user-skin-type', skinResult);
    setStep('result');
  };

  const handleAnswer = (option: typeof questions[0]['options'][0]) => {
    if (currentQ === 5) {
      // 多选：只切换选择状态，不改变分数
      const newSet = new Set(multiSelect);
      if (newSet.has(option.label)) newSet.delete(option.label); else newSet.add(option.label);
      setMultiSelect(newSet);
      return;
    }
    // 单选题：直接计分
    const newScores = { ...scores };
    Object.entries(option.scores).forEach(([key, val]) => { newScores[key] = (newScores[key] || 0) + val; });
    setScores(newScores);
    if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); }
    else { computeResult(newScores); }
  };

  const handleMultiNext = () => {
    if (multiSelect.size === 0) return;
    const newScores = { ...scores };
    multiSelect.forEach(label => {
      const opt = questions[5].options.find(o => o.label === label);
      if (opt) Object.entries(opt.scores).forEach(([key, val]) => { newScores[key] = (newScores[key] || 0) + val; });
    });
    setScores(newScores);
    setMultiSelect(new Set());
    if (currentQ < questions.length - 1) { setCurrentQ(currentQ + 1); }
    else { computeResult(newScores); }
  };

  const restart = () => {
    setStep('quiz'); setCurrentQ(0); setScores({}); setMultiSelect(new Set()); setResult(null);
  };

  // ====== QUIZ VIEW ======
  if (step === 'quiz') {
    const q = questions[currentQ];
    const isMulti = currentQ === 5;
    const isLast = currentQ === questions.length - 1;
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>第 {currentQ + 1} / {questions.length} 题</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-stone-800 to-stone-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-200 mb-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">{q.emoji}</span>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">{q.question}</h2>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">💡 {q.illustration}</p>
            </div>
          </div>

          {isMulti && (
            <p className="text-sm text-stone-700 mb-3 bg-stone-100 px-3 py-1.5 rounded-lg">
              这道题可以多选。选完后点「下一题」继续。
            </p>
          )}

          <div className="space-y-2">
            {q.options.map((opt) => {
              const selected = isMulti ? multiSelect.has(opt.label) : false;
              return (
                <button
                  key={opt.label}
                  onClick={() => handleAnswer(opt)}
                  className={`w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all ${
                    selected
                      ? 'border-stone-500 bg-stone-100 shadow-sm'
                      : 'border-gray-200 hover:border-stone-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 ${
                    selected ? 'bg-stone-800 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>{opt.label}</span>
                  <span className="text-sm md:text-base text-gray-700">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {isMulti && (
            <button onClick={handleMultiNext} disabled={multiSelect.size === 0}
              className="mt-3 w-full py-2.5 bg-stone-800 hover:bg-stone-700 disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors">
              {isLast ? '查看测试结果 →' : `下一步 (已选 ${multiSelect.size} 项)`}
            </button>
          )}
        </div>

        {!isMulti && (
          <div className="flex justify-between">
            <button
              onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)}
              disabled={currentQ === 0}
              className="px-4 py-2 text-sm text-gray-400 disabled:opacity-30 hover:text-gray-600"
            >
              ← 上一题
            </button>
            <div className="text-xs text-gray-400 self-center">
              {currentQ + 1} / {questions.length}
            </div>
            <div />
          </div>
        )}
      </div>
    );
  }

  // ====== RESULT VIEW ======
  if (step === 'result' && result) {
    const info = resultInfo[result];
    const recommendation = skinTypeRecommendations.find(r => r.skinType === result);

    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Result hero */}
        <div className="bg-gradient-to-br from-stone-800 to-stone-600 text-white rounded-2xl p-6 md:p-8 text-center mb-6">
          <span className="text-6xl md:text-7xl block mb-4">{info.emoji}</span>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{info.title}</h1>
          <p className="text-stone-200 text-sm md:text-base">{info.subtitle}</p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-200 mb-6">
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">{info.desc}</p>
          <div className="mt-4 space-y-2">
            {info.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-stone-800 mt-1">✦</span>
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        {recommendation && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-3">🧬 你的专属护肤方案</h2>
            {recommendation.routine.map((step, i) => (
              <div key={i} className="mb-4">
                <h3 className="font-medium text-gray-700 text-sm mb-2">{step.step}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {step.products.map((p) => (
                    <div key={p.name} onClick={() => navigate('/search?q=' + encodeURIComponent(p.name))}
                      className="p-3 bg-white rounded-xl border border-gray-200 hover:border-stone-400 hover:shadow cursor-pointer transition-all">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.brand} · {p.priceCNY}</p>
                        </div>
                        <span className="text-xs font-bold text-amber-600">★ {p.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.editorNote}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 成分指南 */}
        {recommendation && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
              <h4 className="font-semibold text-red-700 mb-2 text-sm">🚫 建议避开</h4>
              <div className="flex flex-wrap gap-1">
                {recommendation.avoidIngredients.map(ing => (
                  <span key={ing} className="px-2 py-0.5 text-xs bg-white text-red-600 rounded-full border border-red-200">{ing}</span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2 text-sm">✅ 应该寻找</h4>
              <div className="flex flex-wrap gap-1">
                {recommendation.seekIngredients.map(ing => (
                  <span key={ing} className="px-2 py-0.5 text-xs bg-white text-green-600 rounded-full border border-green-200">{ing}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button onClick={restart} className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm">
            🔄 重新测试
          </button>
          <button onClick={() => navigate('/explore')} className="px-6 py-2.5 bg-stone-800 text-white font-medium rounded-xl hover:bg-stone-700 transition-colors text-sm">
            🏆 查看编辑精选
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          💡 你的测试结果已保存。下次打开首页会为你推荐适合{result}的产品。
        </p>
      </div>
    );
  }

  return null;
}
