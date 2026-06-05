import { Ingredient } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { useNavigate } from 'react-router-dom';

interface IngredientListItemProps {
  ingredient: Ingredient;
  index?: number;
  expanded?: boolean;
  onToggle?: () => void;
}

export function IngredientListItem({ ingredient, index, expanded = false, onToggle }: IngredientListItemProps) {
  const navigate = useNavigate();

  const getRiskBarColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-green-400';
      case 1: return 'bg-yellow-400';
      case 2: return 'bg-orange-400';
      case 3: return 'bg-red-400';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
      {/* 主行 */}
      <div
        onClick={onToggle}
        className="flex items-center gap-3 p-3 cursor-pointer bg-white hover:bg-gray-50 transition-colors"
      >
        {/* 序号 */}
        {index !== undefined && (
          <span className="text-xs text-gray-400 w-6 text-center shrink-0">{index + 1}</span>
        )}

        {/* 风险等级条 */}
        <div className={`w-1.5 h-8 rounded-full shrink-0 ${getRiskBarColor(ingredient.riskLevel)}`} />

        {/* 名称 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{ingredient.name}</span>
            <span className="text-xs text-gray-400 truncate">{ingredient.nameEn}</span>
          </div>
        </div>

        {/* 功能简述 */}
        <span className="text-xs text-gray-500 hidden md:block max-w-[140px] truncate">
          {ingredient.function}
        </span>

        {/* 风险标签 */}
        <RiskBadge level={ingredient.riskLevel} size="sm" />

        {/* 展开箭头 */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* 展开详细解释 */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">{ingredient.simpleExplanation}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
              {ingredient.category}
            </span>
            {ingredient.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs bg-stone-200 text-stone-700 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/ingredient/${ingredient.id}`); }}
            className="mt-3 text-sm text-stone-700 hover:text-stone-700 font-medium"
          >
            查看完整信息 →
          </button>
        </div>
      )}
    </div>
  );
}
