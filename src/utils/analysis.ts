import { Ingredient, Product, ProductAnalysis, Warning, RiskLevel } from '../types';
import { getIngredientsByIds } from '../data/ingredients';

// ============================================================
// 产品成分分析引擎
// ============================================================

/**
 * 分析一个产品的所有成分，返回完整的分析结果
 */
export function analyzeProduct(product: Product): ProductAnalysis {
  const ingredients = getIngredientsByIds(product.ingredientIds);

  const harmfulIngredients = ingredients.filter((ing) => ing.riskLevel >= 2);
  const irritantIngredients = ingredients.filter((ing) => ing.isIrritant);
  const comedogenicIngredients = ingredients.filter((ing) => ing.isComedogenic);

  // 生成警告列表
  const warnings: Warning[] = [];

  for (const ing of harmfulIngredients) {
    warnings.push({
      ingredientId: ing.id,
      ingredientName: ing.name,
      riskLevel: ing.riskLevel,
      reason: getRiskReason(ing),
    });
  }

  for (const ing of irritantIngredients) {
    if (!warnings.find((w) => w.ingredientId === ing.id)) {
      warnings.push({
        ingredientId: ing.id,
        ingredientName: ing.name,
        riskLevel: ing.riskLevel,
        reason: '此成分对皮肤有刺激性，可能导致泛红、刺痛或过敏',
      });
    }
  }

  for (const ing of comedogenicIngredients) {
    if (!warnings.find((w) => w.ingredientId === ing.id)) {
      warnings.push({
        ingredientId: ing.id,
        ingredientName: ing.name,
        riskLevel: ing.riskLevel,
        reason: '此成分容易堵塞毛孔，可能导致粉刺和痘痘',
      });
    }
  }

  // 计算总体评级
  const overallRating = calculateOverallRating(
    harmfulIngredients.length,
    irritantIngredients.length,
    comedogenicIngredients.length,
    ingredients
  );

  return {
    overallRating,
    harmfulCount: harmfulIngredients.length,
    irritantCount: irritantIngredients.length,
    comedogenicCount: comedogenicIngredients.length,
    warnings,
  };
}

/**
 * 根据风险等级返回简单解释
 */
function getRiskReason(ingredient: Ingredient): string {
  switch (ingredient.riskLevel) {
    case 3:
      if (ingredient.isIrritant) {
        return `高风险成分：${ingredient.function}。此成分致敏率高，可能对皮肤造成明显伤害，强烈建议避开。`;
      }
      return `高风险成分：${ingredient.function}。此成分存在严重安全隐患，可能对健康造成长期伤害，建议避开。`;
    case 2:
      if (ingredient.isIrritant && ingredient.isComedogenic) {
        return `中风险成分：${ingredient.function}。此成分有刺激性和致痘风险，特定肤质需避开。`;
      }
      if (ingredient.isIrritant) {
        return `中风险成分：${ingredient.function}。此成分对皮肤有刺激性，敏感肌需谨慎。`;
      }
      if (ingredient.isComedogenic) {
        return `中风险成分：${ingredient.function}。此成分容易堵塞毛孔，油性肌和痘痘肌需避开。`;
      }
      return `中风险成分：${ingredient.function}。此成分有一定安全隐患，建议谨慎选择。`;
    default:
      return `${ingredient.function}`;
  }
}

/**
 * 根据各种因素计算总体评级
 */
function calculateOverallRating(
  harmfulCount: number,
  irritantCount: number,
  comedogenicCount: number,
  ingredients: Ingredient[]
): 'safe' | 'caution' | 'warning' {
  // 如果有风险等级3的成分，直接警告
  const hasRisk3 = ingredients.some((ing) => ing.riskLevel === 3);
  if (hasRisk3) return 'warning';

  // 如果有多个中高风险成分，警告
  if (harmfulCount >= 3) return 'warning';

  // 如果有1-2个中风险成分，或3个以上刺激/致痘成分，谨慎
  if (harmfulCount >= 1) return 'caution';
  if (irritantCount >= 3) return 'caution';
  if (comedogenicCount >= 3) return 'caution';

  // 其余情况，安全
  return 'safe';
}

/**
 * 获取总体评级的中文标签
 */
export function getRatingLabel(rating: 'safe' | 'caution' | 'warning'): string {
  switch (rating) {
    case 'safe':
      return '安心使用';
    case 'caution':
      return '谨慎选择';
    case 'warning':
      return '建议避开';
  }
}

/**
 * 获取总体评级的详细描述
 */
export function getRatingDescription(rating: 'safe' | 'caution' | 'warning'): string {
  switch (rating) {
    case 'safe':
      return '这款产品的成分比较温和安全，没有发现明显的有害或刺激成分，大多数人都可以放心使用。';
    case 'caution':
      return '这款产品含有一些需要注意的成分，特定肤质（如敏感肌、痘痘肌）在使用前建议仔细查看成分分析。';
    case 'warning':
      return '这款产品含有高风险或较多刺激成分，可能对皮肤造成伤害，强烈建议谨慎选择或寻找更安全的替代品。';
  }
}

/**
 * 获取风险等级对应的颜色类名
 */
export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 0:
      return 'bg-green-100 text-green-800 border-green-300';
    case 1:
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 2:
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 3:
      return 'bg-red-100 text-red-800 border-red-300';
  }
}

/**
 * 获取风险等级对应的纯色（用于圆点和强调）
 */
export function getRiskDotColor(level: RiskLevel): string {
  switch (level) {
    case 0:
      return 'bg-green-500';
    case 1:
      return 'bg-yellow-500';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-red-500';
  }
}

/**
 * 获取风险等级对应的中文标签
 */
export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case 0:
      return '安全';
    case 1:
      return '低风险';
    case 2:
      return '中等风险';
    case 3:
      return '高风险';
  }
}

/**
 * 获取风险等级对应的表情符号
 */
export function getRiskEmoji(level: RiskLevel): string {
  switch (level) {
    case 0:
      return '✅';
    case 1:
      return '⚠️';
    case 2:
      return '🔶';
    case 3:
      return '🔴';
  }
}

/**
 * 根据肤质过滤：获取产品中不适合特定肤质的成分
 */
export function getIngredientsBadForSkinType(
  ingredients: Ingredient[],
  skinType: string
): Ingredient[] {
  return ingredients.filter((ing) => ing.badFor.includes(skinType as any));
}

/**
 * 根据肤质过滤：获取产品中适合特定肤质的成分
 */
export function getIngredientsGoodForSkinType(
  ingredients: Ingredient[],
  skinType: string
): Ingredient[] {
  return ingredients.filter((ing) => ing.goodFor.includes(skinType as any));
}
