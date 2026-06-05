import { useState } from 'react';
import { Ingredient } from '../../types';
import { IngredientListItem } from '../ingredient/IngredientListItem';

interface IngredientBreakdownProps {
  ingredients: Ingredient[];
}

export function IngredientBreakdown({ ingredients }: IngredientBreakdownProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (ingredients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-lg">暂无成分数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">
          完整成分列表（{ingredients.length} 种）
        </h3>
        <span className="text-xs text-gray-400">按含量从高到低排列</span>
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> 安全</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> 低风险</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block" /> 中风险</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> 高风险</span>
      </div>

      {ingredients.map((ingredient, idx) => (
        <IngredientListItem
          key={ingredient.id}
          ingredient={ingredient}
          index={idx}
          expanded={expandedId === ingredient.id}
          onToggle={() => toggleExpand(ingredient.id)}
        />
      ))}
    </div>
  );
}
