// ===== 成分分类 =====
export enum IngredientCategory {
  MOISTURIZER = '保湿剂',
  EMOLLIENT = '润肤剂',
  SURFACTANT = '表面活性剂',
  PRESERVATIVE = '防腐剂',
  FRAGRANCE = '香精',
  ANTIOXIDANT = '抗氧化剂',
  UV_FILTER = '防晒剂',
  EXFOLIANT = '去角质成分',
  EMULSIFIER = '乳化剂',
  COLORANT = '着色剂',
  ACTIVE = '活性成分',
  THICKENER = '增稠剂',
  ALCOHOL = '醇类',
  ACID = '酸类',
  OIL = '油脂类',
  OTHER = '其他',
}

// ===== 风险等级 =====
// 0 = 安全（绿色）— 大多数人都能放心使用
// 1 = 低风险（黄色）— 大多数人安全，少数敏感肌需要注意
// 2 = 中风险（橙色）— 有一定风险，特定肤质建议避开
// 3 = 高风险（红色）— 可能伤害皮肤，建议避开
export type RiskLevel = 0 | 1 | 2 | 3;

// ===== 肤质类型 =====
export type SkinType = '干性肌' | '油性肌' | '混合肌' | '敏感肌' | '中性肌' | '痘痘肌';

// ===== 成分数据 =====
export interface Ingredient {
  id: string;
  name: string;                    // 成分中文名
  nameEn: string;                  // 英文名 / INCI 名称
  aliases: string[];               // 常见别名
  category: IngredientCategory;    // 分类
  riskLevel: RiskLevel;            // 安全风险等级
  isIrritant: boolean;             // 是否具有刺激性
  isComedogenic: boolean;          // 是否致痘 / 堵塞毛孔
  function: string;                // 主要功能（一句话概括）
  simpleExplanation: string;       // 简单易懂的详细解释（核心字段）
  goodFor: SkinType[];             // 适合的肤质
  badFor: SkinType[];              // 不适合的肤质
  tags: string[];                  // 标签，如 "孕妇慎用"、"酒精类"、"合成香精" 等
}

// ===== 产品类别 =====
export type ProductCategory = 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'mask' | 'other';

export const ProductCategoryLabel: Record<ProductCategory, string> = {
  cleanser: '洁面',
  toner: '爽肤水',
  serum: '精华',
  moisturizer: '面霜/乳液',
  sunscreen: '防晒',
  mask: '面膜',
  other: '其他',
};

// ===== 警告信息 =====
export interface Warning {
  ingredientId: string;
  ingredientName: string;
  riskLevel: RiskLevel;
  reason: string; // 为什么这个成分需要警惕
}

// ===== 产品分析结果 =====
export interface ProductAnalysis {
  overallRating: 'safe' | 'caution' | 'warning';
  harmfulCount: number;     // 高风险成分数量
  irritantCount: number;    // 刺激成分数量
  comedogenicCount: number; // 致痘成分数量
  warnings: Warning[];
}

// ===== 价格段位 =====
export type PriceTier = 'budget' | 'mid' | 'premium' | 'luxury';

export const PriceTierLabel: Record<PriceTier, string> = {
  budget: '💰 平价',
  mid: '💰💰 中端',
  premium: '💰💰💰 高端',
  luxury: '💰💰💰💰 奢侈',
};

// ===== 性价比评级 =====
export type ValueRating = 'great-value' | 'fair' | 'overpriced' | 'not-worth-it';

export const ValueRatingLabel: Record<ValueRating, string> = {
  'great-value': '平民好物',
  'fair': '物有所值',
  'overpriced': '品牌溢价',
  'not-worth-it': '不值得买',
};

export const ValueRatingColor: Record<ValueRating, string> = {
  'great-value': 'bg-green-100 text-green-800 border-green-300',
  'fair': 'bg-blue-100 text-blue-800 border-blue-300',
  'overpriced': 'bg-orange-100 text-orange-800 border-orange-300',
  'not-worth-it': 'bg-red-100 text-red-800 border-red-300',
};

// ===== 产品数据 =====
export interface Product {
  id: string;
  name: string;                    // 产品名称
  brand: string;                   // 品牌
  category: ProductCategory;       // 产品类别
  ingredientIds: string[];         // 成分 ID 列表（按含量从高到低排列）
  summary?: string;                // 一句话总结
  suitableFor?: SkinType[];        // 适合什么肤质
  targets?: string[];              // 专门针对/攻克什么问题
  pros?: string[];                 // 优点
  cons?: string[];                 // 缺点
  image?: string;                  // 产品图片 URL（可选）
  price?: number;                  // 参考价格（人民币）
  capacity?: string;               // 容量，如 "150ml"、"50g"
  priceTier?: PriceTier;           // 价格段位
  valueRating?: ValueRating;       // 性价比评级
  valueNote?: string;              // 性价比一句话点评
}

// 带完整成分信息的产品（在产品详情页使用）
export interface ProductWithIngredients extends Product {
  ingredients: Ingredient[];       // 展开后的完整成分信息
  analysis: ProductAnalysis;       // 分析结果
}

// ===== 搜索相关 =====
export type SearchResultType = 'product' | 'ingredient';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  name: string;
  highlight: string;               // 显示在卡片上的亮点信息
  riskLevel?: RiskLevel;           // 产品的总体风险 或 成分的风险等级
  category?: string;               // 产品类别 或 成分分类
}

// ===== 筛选相关 =====
export interface FilterOptions {
  riskLevel: RiskLevel | null;     // null = 不限
  category: string | null;         // null = 不限
  skinType: SkinType | null;       // 按肤质筛选
}
