import { Ingredient } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { useNavigate } from 'react-router-dom';

interface IngredientCardProps {
  ingredient: Ingredient;
  compact?: boolean;
}

export function IngredientCard({ ingredient, compact = false }: IngredientCardProps) {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/ingredient/${ingredient.id}`)}
        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm cursor-pointer transition-all"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-gray-800 truncate">{ingredient.name}</span>
          <span className="text-xs text-gray-400 hidden sm:inline truncate">{ingredient.nameEn}</span>
        </div>
        <RiskBadge level={ingredient.riskLevel} size="sm" />
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/ingredient/${ingredient.id}`)}
      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-800">{ingredient.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{ingredient.nameEn}</p>
        </div>
        <RiskBadge level={ingredient.riskLevel} size="md" />
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{ingredient.simpleExplanation}</p>
      <div className="flex flex-wrap gap-1 mt-3">
        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">{ingredient.category}</span>
        {ingredient.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="px-2 py-0.5 text-xs bg-purple-50 text-purple-600 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  );
}
