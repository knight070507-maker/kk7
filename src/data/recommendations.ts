// ============================================================
// 全球护肤品编辑精选推荐 — 基于深度研究 + 皮肤科医生共识
// 研究来源：Reddit, 皮肤科医生YouTube, Beautypedia, INCIDecoder,
//   AsianBeauty, Olive Young, Cosme, 化妆品化学家, 临床数据
// ============================================================

export interface EditorPick {
  rank: number;
  name: string;
  brand: string;
  price: string;
  priceCNY: string;
  category: string;
  skinTypes: string[];
  bestFor: string;
  whyPicked: string;
  editorNote: string;
  drawback: string;
  rating: number;
  sourceTag: string; // 'derm-approved' | 'cult-classic' | 'hidden-gem' | 'science-backed'
}

export interface SkinTypeRecommendation {
  skinType: string;
  title: string;
  description: string;
  routine: {
    step: string;
    products: EditorPick[];
  }[];
  avoidIngredients: string[];
  seekIngredients: string[];
}

// ===== 编辑精选：全球最佳洁面 =====
export const bestCleansers: EditorPick[] = [
  {
    rank: 1, name: 'Vanicream 温和洁面乳', brand: 'Vanicream',
    price: '~$13', priceCNY: '~¥90', category: '洁面',
    skinTypes: ['敏感肌', '油性肌', '痘痘肌'],
    bestFor: '所有肤质，尤其是极度敏感/湿疹肌',
    whyPicked: '成分仅8种，被超过10位知名皮肤科医生推荐为「最安心的洁面」。获美国湿疹协会认证。pH值平衡，无香精无色素无甲醛释放体。',
    editorNote: '皮肤科医生的共识：如果你不知道买什么洁面，就买Vanicream。比CeraVe更温和，比Cetaphil成分更干净。',
    drawback: '不起泡（低泡凝胶质地），喜欢泡沫的人会不习惯',
    rating: 9.5, sourceTag: 'derm-approved',
  },
  {
    rank: 2, name: 'Prequel Gleanser', brand: 'Prequel',
    price: '~$18', priceCNY: '~¥130', category: '洁面',
    skinTypes: ['干性肌', '敏感肌', '中性肌'],
    bestFor: '干皮、屏障受损、A醇使用者',
    whyPicked: '含50%甘油——洁面产品中闻所未闻的浓度。由皮肤科医生Dr. Sam Ellis创立。临床验证使用一次后24小时持续保湿。pH 4.5。400ml大容量。',
    editorNote: '2024年最被低估的创新洁面。50%甘油意味着边洗脸边补水。使用A醇/酸类的人用这个，脱皮情况会明显减少。',
    drawback: '质地像蜂蜜，需要摸索加水量；国内暂无官方渠道购买',
    rating: 9.3, sourceTag: 'science-backed',
  },
  {
    rank: 3, name: 'Beauty of Joseon 青梅清新洁面乳', brand: 'Beauty of Joseon',
    price: '~$11', priceCNY: '~¥80', category: '洁面',
    skinTypes: ['干性肌', '油性肌', '混合肌', '敏感肌'],
    bestFor: '所有肤质，尤其是敏感/痘痘肌',
    whyPicked: '24.5%青梅水+3%绿豆提取物，天然氨基酸表活，pH 5.5。DermApproved评分83/100。《Glamour》2025年评为最佳韩国洁面。',
    editorNote: '韩国洁面产品中的金标准。传统韩方+现代温和表活，是我在韩国Olive Young榜单上最认可的产品。',
    drawback: '100ml容量偏小（建议买200ml大包装）',
    rating: 9.2, sourceTag: 'cult-classic',
  },
  {
    rank: 4, name: 'CeraVe 水合保湿洁面乳', brand: 'CeraVe 适乐肤',
    price: '~$11-16', priceCNY: '~¥108', category: '洁面',
    skinTypes: ['干性肌', '敏感肌'],
    bestFor: '干皮、湿疹倾向、屏障受损',
    whyPicked: '三重神经酰胺专利递送技术+透明质酸。无泡配方完全不刺激。皮肤科医生最常推荐的洁面之一。',
    editorNote: '如果你的脸洗完有紧绷感，说明洁面太刺激了。换这个试试——洗完像拍了爽肤水一样柔软。',
    drawback: '清洁力偏弱，油皮夏天不够；不起泡',
    rating: 9.0, sourceTag: 'derm-approved',
  },
  {
    rank: 5, name: 'Kose Softymo 速效卸妆油', brand: 'Kose 高丝',
    price: '~$10', priceCNY: '~¥70', category: '卸妆',
    skinTypes: ['油性肌', '混合肌', '中性肌'],
    bestFor: '日常卸妆+防晒，追求极致性价比',
    whyPicked: '世界级乳化技术，10美元做到植村秀380元卸妆油95%的效果。冲水即乳化，零残留。日本药妆店常青树。',
    editorNote: '卸妆油这个品类，贵的和便宜的差距主要在香味和包装。乳化技术上，Kose就是天花板。没必要花更多钱。',
    drawback: '矿物油基底少数人致痘；含柑橘精油（少数版本）',
    rating: 9.1, sourceTag: 'hidden-gem',
  },
];

// ===== 编辑精选：全球最佳精华 =====
export const bestSerums: EditorPick[] = [
  {
    rank: 1, name: '修丽可CE抗氧化精华', brand: 'SkinCeuticals 修丽可',
    price: '~$169', priceCNY: '~¥1490', category: '精华',
    skinTypes: ['干性肌', '中性肌', '混合肌'],
    bestFor: '抗氧化、抗老、白天抵御紫外线损伤',
    whyPicked: '15%VC+1%VE+0.5%阿魏酸的黄金组合。护肤品中极少数有大量临床数据支撑的配方。专利pH维持在2.0-3.5确保VC渗透。',
    editorNote: '抗氧化精华的天花板。贵，但临床数据不会骗人。如果预算只够买一个贵的产品，就买这个。',
    drawback: '1490元确实贵；开瓶后需尽快用完；有药的焦味',
    rating: 9.5, sourceTag: 'science-backed',
  },
  {
    rank: 2, name: '宝拉珍选2%水杨酸精华液', brand: "Paula's Choice 宝拉珍选",
    price: '~$34', priceCNY: '~¥268', category: '精华/去角质',
    skinTypes: ['油性肌', '痘痘肌', '混合肌'],
    bestFor: '黑头、闭口、毛孔堵塞、痘痘',
    whyPicked: '2%水杨酸黄金浓度+洋甘菊舒缓，配方精良。全球最畅销的水杨酸产品。pH 3.2-3.6确保有效的游离酸浓度。',
    editorNote: '水杨酸产品的教科书级配方。很多品牌都出水杨酸，但配方的精细程度和有效性，宝拉是标杆。',
    drawback: '268元不算便宜；有油感；必须防晒',
    rating: 9.3, sourceTag: 'science-backed',
  },
  {
    rank: 3, name: 'The Ordinary 10%烟酰胺+1%锌精华', brand: 'The Ordinary',
    price: '~$6', priceCNY: '~¥55', category: '精华',
    skinTypes: ['油性肌', '痘痘肌', '混合肌'],
    bestFor: '控油、缩小毛孔、提亮肤色',
    whyPicked: '10%烟酰胺+1%PCA锌。配方诚实到极致——就告诉你浓度和成分，不搞噱头。55元买全球最强控油精华之一。',
    editorNote: '成分党的入门必修课。55元买到治疗级的烟酰胺浓度，不需要花300元买OLAY。但10%浓度可能不耐受，从隔天用开始。',
    drawback: '质地黏；高浓度可能不耐受；容易和后续产品搓泥',
    rating: 9.0, sourceTag: 'cult-classic',
  },
  {
    rank: 4, name: 'Beauty of Joseon 蜂胶烟酰胺焕亮精华', brand: 'Beauty of Joseon',
    price: '~$17', priceCNY: '~¥120', category: '精华',
    skinTypes: ['干性肌', '混合肌', '中性肌'],
    bestFor: '提亮肤色、保湿、维稳',
    whyPicked: '60%蜂胶提取物+2%烟酰胺。蜂胶是天然抗炎抗菌成分，同时超级保湿。质地像蜂蜜但上脸不黏。',
    editorNote: '韩国Olive Young精华类销量冠军。不是靠营销——蜂胶+烟酰胺这个组合在舒缓和提亮上确实均衡出色。',
    drawback: '不是猛药型美白精华，效果偏温和缓慢',
    rating: 9.1, sourceTag: 'cult-classic',
  },
  {
    rank: 5, name: 'Naturium 视黄醇复合精华', brand: 'Naturium',
    price: '~$25', priceCNY: '~¥180', category: '精华',
    skinTypes: ['混合肌', '中性肌'],
    bestFor: 'A醇入门、抗初老',
    whyPicked: '包裹型视黄醇+生物视黄醇（补骨脂酚前体），比传统A醇温和但效果不差。含神经酰胺和角鲨烷缓冲刺激。',
    editorNote: 'A醇新手的最佳入门选择之一。比露得清A醇更温和，比The Ordinary更"精致"。180元买到这个配方很值。',
    drawback: '浓度偏低，A醇老手会觉得不够劲；国内不好买',
    rating: 8.9, sourceTag: 'science-backed',
  },
  {
    rank: 6, name: 'Geek & Gorgeous A-Game 5', brand: 'Geek & Gorgeous',
    price: '~€14', priceCNY: '~¥115', category: '精华',
    skinTypes: ['混合肌', '中性肌', '油性肌'],
    bestFor: 'A醇进阶（已建立耐受者）',
    whyPicked: '0.05%视黄醛——比普通视黄醇转化效率高11倍。欧洲小众品牌，配方极简没有多余成分。冷藏运输保证活性。',
    editorNote: '护肤圈内人的秘密武器。视黄醛是A醇和A酸之间的"高速通道"，比A醇快得多但没A酸刺激。欧洲直邮。',
    drawback: '必须冷藏（保质期短）；新手绝对不要碰这个浓度；跨境购买不便',
    rating: 9.2, sourceTag: 'hidden-gem',
  },
];

// ===== 编辑精选：全球最佳面霜 =====
export const bestMoisturizers: EditorPick[] = [
  {
    rank: 1, name: 'CeraVe 修护保湿霜', brand: 'CeraVe 适乐肤',
    price: '~$16', priceCNY: '~¥118', category: '面霜',
    skinTypes: ['干性肌', '敏感肌', '中性肌'],
    bestFor: '屏障修护、全身保湿、全家共用',
    whyPicked: '三种神经酰胺+MVE缓释技术。340g大容量。全球皮肤科医生推荐最多的保湿产品。',
    editorNote: '118元买340g，用到天荒地老。如果你想简化护肤，这一罐脸+身体全搞定。没有花哨成分，但保湿这件事做得无可挑剔。',
    drawback: '质地偏厚重，油皮夏天不适合',
    rating: 9.4, sourceTag: 'derm-approved',
  },
  {
    rank: 2, name: '理肤泉B5多效修复霜', brand: 'La Roche-Posay 理肤泉',
    price: '~$16', priceCNY: '~¥129', category: '面霜',
    skinTypes: ['敏感肌', '干性肌', '痘痘肌'],
    bestFor: '泛红急救、屏障受损、刷酸后修复',
    whyPicked: '5%泛醇+积雪草苷+氧化锌。敏感肌圈公认的"救命霜"。泛红起皮厚敷一晚，第二天明显好转。',
    editorNote: '敏感肌人手一支不是营销——5%泛醇+积雪草苷这个组合确实强。129元比看皮肤科便宜多了。',
    drawback: '质地厚重白天不能用；含羊毛脂少数人致痘',
    rating: 9.3, sourceTag: 'derm-approved',
  },
  {
    rank: 3, name: 'Illiyoon 神经酰胺修护保湿霜', brand: 'Illiyoon 一理润',
    price: '~$15', priceCNY: '~¥100', category: '面霜',
    skinTypes: ['干性肌', '敏感肌'],
    bestFor: '极度干燥、屏障修护、身体保湿',
    whyPicked: '韩国爱茉莉太平洋旗下药妆线。神经酰胺胶囊技术（肉眼可见的小颗粒），上脸揉开释放。200ml大容量。在韩国Hwahae面霜榜常年前三。',
    editorNote: '韩国的"CeraVe"但更滋润。神经酰胺胶囊不是噱头——能保护神经酰胺不被氧化，涂开瞬间释放。干皮冬天亲妈。',
    drawback: '油皮会觉得太厚重；国内没有官方渠道',
    rating: 9.1, sourceTag: 'hidden-gem',
  },
  {
    rank: 4, name: 'Dieux Instant Angel 屏障修护霜', brand: 'Dieux',
    price: '~$45', priceCNY: '~¥320', category: '面霜',
    skinTypes: ['干性肌', '敏感肌', '中性肌'],
    bestFor: '屏障修护、A醇伴侣、熟龄肌',
    whyPicked: '神经酰胺+胆固醇+脂肪酸以3:1:1的皮肤仿生比例调配——这是皮肤屏障的天然组成比例。比随机加神经酰胺科学得多。',
    editorNote: '如果CeraVe是屏障修护的"大众版"，Dieux就是"精装版"。3:1:1的比例有学术论文支撑。320元不便宜但配方值得。',
    drawback: '320元偏贵；美国品牌国内不好买',
    rating: 9.2, sourceTag: 'science-backed',
  },
  {
    rank: 5, name: 'Vanicream 保湿霜', brand: 'Vanicream',
    price: '~$14', priceCNY: '~¥95', category: '面霜',
    skinTypes: ['敏感肌', '干性肌'],
    bestFor: '极度敏感、湿疹、过敏体质',
    whyPicked: '成分极简到极致。不含任何常见过敏原（香精、染料、羊毛脂、对羟基苯甲酸酯、甲醛、麸质）。获美国湿疹协会认证。',
    editorNote: '如果所有面霜都用不了就试试它。成分简单到几乎没有过敏的可能。不是最滋润的，但是最安全的。',
    drawback: '只有基础保湿，没有任何活性成分；质地偏腻',
    rating: 9.0, sourceTag: 'derm-approved',
  },
  {
    rank: 6, name: 'Stratia Liquid Gold 液体黄金', brand: 'Stratia',
    price: '~$27', priceCNY: '~¥195', category: '面霜/精华',
    skinTypes: ['干性肌', '敏感肌', '混合肌'],
    bestFor: '屏障修复、泛红、玫瑰痤疮',
    whyPicked: '神经酰胺+胆固醇+脂肪酸+沙棘果油的屏障修复组合。Reddit上被封为"屏障修复神器"。含4%烟酰胺+2%N-乙酰葡萄糖胺。',
    editorNote: 'Reddit社区集体智慧的结晶。沙棘果油（天然橙黄色）的抗氧化和修复能力极强。195元买这个配方超值。',
    drawback: '橙黄色可能染色；质地偏油；保质期短',
    rating: 9.1, sourceTag: 'cult-classic',
  },
];

// ===== 编辑精选：全球最佳防晒 =====
export const bestSunscreens: EditorPick[] = [
  {
    rank: 1, name: 'Beauty of Joseon 大米益生菌防晒霜', brand: 'Beauty of Joseon',
    price: '~$18', priceCNY: '~¥130', category: '防晒',
    skinTypes: ['干性肌', '混合肌', '中性肌', '敏感肌'],
    bestFor: '日常通勤，追求极致肤感',
    whyPicked: '韩国防晒销量冠军。大米提取物+益生菌+烟酰胺。肤感像轻乳液——完全不泛白、不油腻、不搓泥。韩国防晒肤感的天花板。',
    editorNote: '用过这支防晒的人很难再用回欧美防晒。肤感差距太大了。日常通勤防护够用，但户外暴晒不行。',
    drawback: '不防水（户外运动不行）；防护力不如安热沙',
    rating: 9.4, sourceTag: 'cult-classic',
  },
  {
    rank: 2, name: '理肤泉大哥大防晒乳 UVMune 400', brand: 'La Roche-Posay 理肤泉',
    price: '~$25', priceCNY: '~¥168', category: '防晒',
    skinTypes: ['油性肌', '混合肌', '中性肌'],
    bestFor: '最强防护力、户外活动、光敏感',
    whyPicked: '欧莱雅集团独家Mexoryl 400专利防晒剂——全球唯一能有效阻挡380-400nm超长波UVA的防晒剂。UVA防护力无可匹敌。',
    editorNote: '如果你只在乎防护力不在乎肤感，买它。UVMune 400的UVA防护是所有防晒中的技术巅峰。比安热沙防护更强。',
    drawback: '含酒精；质地有些人觉得油',
    rating: 9.3, sourceTag: 'science-backed',
  },
  {
    rank: 3, name: 'SKIN1004 积雪草防晒精华', brand: 'SKIN1004',
    price: '~$14', priceCNY: '~¥100', category: '防晒',
    skinTypes: ['敏感肌', '痘痘肌', '油性肌'],
    bestFor: '敏感肌日常防晒、舒缓',
    whyPicked: '积雪草提取物含量高，边防晒边舒缓。质地像水精华一样轻薄。韩国Hwahae防晒榜Top 3。',
    editorNote: '敏感肌防晒的韩国优选。积雪草舒缓+化学防晒剂的组合做得很平衡。100元价位无敌。',
    drawback: '不防水；大油皮可能下午微泛油光',
    rating: 9.1, sourceTag: 'cult-classic',
  },
  {
    rank: 4, name: 'Supergoop! 透明无感防晒霜', brand: 'Supergoop!',
    price: '~$38', priceCNY: '~¥270', category: '防晒',
    skinTypes: ['油性肌', '混合肌'],
    bestFor: '妆前打底、隐形毛孔',
    whyPicked: '完全透明硅感防晒，不泛白、填毛孔。妆前打底+防晒二合一。欧美网红防晒中少数真正好用的。',
    editorNote: '唯一能做到完全透明的防晒。妆前打底效果超过很多专业妆前乳。270元贵但有道理。',
    drawback: '硅感重；270元偏贵；国内不好买',
    rating: 8.9, sourceTag: 'cult-classic',
  },
  {
    rank: 5, name: 'EltaMD UV Clear 清透防晒', brand: 'EltaMD',
    price: '~$41', priceCNY: '~¥290', category: '防晒',
    skinTypes: ['痘痘肌', '敏感肌', '混合肌'],
    bestFor: '痘痘肌、玫瑰痤疮、医美术后',
    whyPicked: '美国皮肤科医生推荐最多的防晒。5%烟酰胺+透明质酸。物化结合。专为问题肌肤设计——防晒同时控油抗炎。',
    editorNote: '如果防晒容易让你长痘，试试EltaMD。它的烟酰胺浓度（5%）达到了治疗级，不只防晒还在帮你改善皮肤。',
    drawback: '290元偏贵；会泛白（物理防晒剂）；国内不好买',
    rating: 9.2, sourceTag: 'derm-approved',
  },
];

// ===== 肤质推荐引擎 =====
export const skinTypeRecommendations: SkinTypeRecommendation[] = [
  {
    skinType: '干性肌',
    title: '干性肌护肤方案',
    description: '你的目标是「补水+锁水+修护屏障」。干皮缺少的是脂质和天然保湿因子，不是"缺水"那么简单。',
    routine: [
      {
        step: '洁面',
        products: [bestCleansers[1], bestCleansers[3]], // Prequel, CeraVe
      },
      {
        step: '精华',
        products: [bestSerums[3], bestSerums[5]], // BOJ蜂胶, Geek & Gorgeous A-Game
      },
      {
        step: '面霜',
        products: [bestMoisturizers[3], bestMoisturizers[5], bestMoisturizers[0]], // Illiyoon, Stratia, CeraVe
      },
      {
        step: '防晒',
        products: [bestSunscreens[0], bestSunscreens[2]], // BOJ防晒, SKIN1004
      },
    ],
    avoidIngredients: ['酒精', 'SLS/SLES', '高浓度果酸', '物理磨砂颗粒'],
    seekIngredients: ['神经酰胺', '角鲨烷', '甘油', '透明质酸', '乳木果油', '泛醇'],
  },
  {
    skinType: '油性肌',
    title: '油性肌护肤方案',
    description: '你的目标是「控油不脱水+疏通毛孔」。很多人因为怕油而不涂保湿——结果皮肤更油。控油靠成分，不是靠"什么都不涂"。',
    routine: [
      {
        step: '洁面',
        products: [bestCleansers[0], bestCleansers[2]], // Vanicream, BOJ青梅
      },
      {
        step: '精华',
        products: [bestSerums[1], bestSerums[2]], // 宝拉BHA, TO烟酰胺
      },
      {
        step: '面霜',
        products: [bestMoisturizers[3]], // Illiyoon（少量）
      },
      {
        step: '防晒',
        products: [bestSunscreens[2], bestSunscreens[3]], // SKIN1004, Supergoop!
      },
    ],
    avoidIngredients: ['矿物油', '羊毛脂', '椰子油', '高浓度封闭剂'],
    seekIngredients: ['烟酰胺', '水杨酸', 'PCA锌', '金缕梅', '壬二酸', '神经酰胺'],
  },
  {
    skinType: '敏感肌',
    title: '敏感肌护肤方案',
    description: '你的目标是「精简+修护+避开刺激」。敏感肌最大的敌人不是"不够营养"，而是"太多东西"。越少越好。',
    routine: [
      {
        step: '洁面',
        products: [bestCleansers[0], bestCleansers[2]], // Vanicream, BOJ青梅
      },
      {
        step: '精华',
        products: [bestSerums[3]], // BOJ蜂胶
      },
      {
        step: '面霜',
        products: [bestMoisturizers[4], bestMoisturizers[1], bestMoisturizers[5]], // Vanicream霜, 理肤泉B5, Stratia
      },
      {
        step: '防晒',
        products: [bestSunscreens[2], bestSunscreens[0]], // SKIN1004, BOJ防晒
      },
    ],
    avoidIngredients: ['酒精', '香精', '精油', 'SLS', 'MIT防腐剂', '高浓度酸类', '视黄醇（初期）'],
    seekIngredients: ['积雪草', '神经酰胺', '泛醇', '甘草酸二钾', '尿囊素', '角鲨烷'],
  },
  {
    skinType: '痘痘肌',
    title: '痘痘肌护肤方案',
    description: '你的目标是「疏通+抗炎+不刺激」。痘痘肌最大的误区是疯狂清洁+不保湿——结果皮肤更油更敏感。',
    routine: [
      {
        step: '洁面',
        products: [bestCleansers[0], bestCleansers[2]], // Vanicream, BOJ青梅
      },
      {
        step: '精华',
        products: [bestSerums[1], bestSerums[2]], // 宝拉BHA, TO烟酰胺
      },
      {
        step: '面霜',
        products: [bestMoisturizers[1]], // 理肤泉B5（点涂或薄涂）
      },
      {
        step: '防晒',
        products: [bestSunscreens[4], bestSunscreens[2]], // EltaMD, SKIN1004
      },
    ],
    avoidIngredients: ['椰子油', '羊毛脂', '矿物油', '高浓度封闭剂', '酒精含量高的产品'],
    seekIngredients: ['水杨酸', '壬二酸', '烟酰胺', 'PCA锌', '积雪草', '茶树精油'],
  },
  {
    skinType: '混合肌',
    title: '混合肌护肤方案',
    description: '你的目标是「T区控油+U区保湿」。分区护理不是必须的——选对产品可以一瓶搞定全脸。',
    routine: [
      {
        step: '洁面',
        products: [bestCleansers[2], bestCleansers[1]], // BOJ青梅, Prequel
      },
      {
        step: '精华',
        products: [bestSerums[2], bestSerums[3]], // TO烟酰胺, BOJ蜂胶
      },
      {
        step: '面霜',
        products: [bestMoisturizers[3], bestMoisturizers[5]], // Illiyoon, Stratia
      },
      {
        step: '防晒',
        products: [bestSunscreens[0], bestSunscreens[2]], // BOJ防晒, SKIN1004
      },
    ],
    avoidIngredients: ['高浓度酒精', '过厚重的封闭型面霜'],
    seekIngredients: ['烟酰胺', '神经酰胺', '甘油', '透明质酸'],
  },
  {
    skinType: '中性肌',
    title: '中性肌护肤方案',
    description: '你的皮肤状态已经很好了！目标是「维持+抗老+抗氧化」。不需要复杂的步骤，做好基础+防晒就是最好的护肤。',
    routine: [
      {
        step: '洁面',
        products: [bestCleansers[2], bestCleansers[1]], // BOJ青梅, Prequel
      },
      {
        step: '精华',
        products: [bestSerums[0], bestSerums[3]], // 修丽可CE, BOJ蜂胶
      },
      {
        step: '面霜',
        products: [bestMoisturizers[3], bestMoisturizers[5]], // Dieux, Stratia
      },
      {
        step: '防晒',
        products: [bestSunscreens[0], bestSunscreens[1]], // BOJ防晒, 理肤泉
      },
    ],
    avoidIngredients: ['没有特别需要避开的'],
    seekIngredients: ['VC/VE/阿魏酸', '胜肽', '神经酰胺', '烟酰胺'],
  },
];
