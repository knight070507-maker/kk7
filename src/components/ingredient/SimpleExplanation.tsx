import { Ingredient } from '../../types';

interface SimpleExplanationProps {
  ingredient: Ingredient;
}

export function SimpleExplanation({ ingredient }: SimpleExplanationProps) {
  const getBgColor = () => {
    switch (ingredient.riskLevel) {
      case 0: return 'bg-green-50 border-green-200';
      case 1: return 'bg-yellow-50 border-yellow-200';
      case 2: return 'bg-orange-50 border-orange-200';
      case 3: return 'bg-red-50 border-red-200';
    }
  };

  const getTitleColor = () => {
    switch (ingredient.riskLevel) {
      case 0: return 'text-green-700';
      case 1: return 'text-yellow-700';
      case 2: return 'text-orange-700';
      case 3: return 'text-red-700';
    }
  };

  const getEmoji = () => {
    switch (ingredient.riskLevel) {
      case 0: return '✅';
      case 1: return '⚠️';
      case 2: return '🔶';
      case 3: return '🔴';
    }
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${getBgColor()}`}>
      <h4 className={`font-semibold mb-2 ${getTitleColor()}`}>
        {getEmoji()} 简单来说...
      </h4>
      <p className="text-gray-700 leading-relaxed">{ingredient.simpleExplanation}</p>
    </div>
  );
}
