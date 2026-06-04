import { RiskLevel } from '../../types';
import { getRiskColor, getRiskDotColor, getRiskLabel, getRiskEmoji } from '../../utils/analysis';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showEmoji?: boolean;
}

export function RiskBadge({ level, size = 'md', showLabel = true, showEmoji = false }: RiskBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${getRiskColor(level)} ${sizeClasses[size]}`}
    >
      <span className={`inline-block w-2 h-2 rounded-full ${getRiskDotColor(level)}`} />
      {showEmoji && getRiskEmoji(level)}
      {showLabel && getRiskLabel(level)}
    </span>
  );
}
