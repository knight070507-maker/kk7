import { ProductAnalysis } from '../../types';
import { getRatingLabel, getRatingDescription } from '../../utils/analysis';

interface ProductAnalysisProps {
  analysis: ProductAnalysis;
}

export function ProductAnalysisSummary({ analysis }: ProductAnalysisProps) {
  const getStyles = () => {
    switch (analysis.overallRating) {
      case 'safe':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300',
          badge: 'bg-green-500',
          text: 'text-green-700',
          label: 'text-green-600',
        };
      case 'caution':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300',
          badge: 'bg-yellow-500',
          text: 'text-yellow-700',
          label: 'text-yellow-600',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300',
          badge: 'bg-red-500',
          text: 'text-red-700',
          label: 'text-red-600',
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`p-5 rounded-2xl border-2 ${styles.bg}`}>
      {/* 评级徽章 */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-14 h-14 rounded-full ${styles.badge} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
          {analysis.overallRating === 'safe' ? '✓' : analysis.overallRating === 'caution' ? '!' : '✕'}
        </div>
        <div>
          <div className={`text-2xl font-bold ${styles.label}`}>
            {getRatingLabel(analysis.overallRating)}
          </div>
          <p className={`text-sm mt-0.5 ${styles.text}`}>
            {getRatingDescription(analysis.overallRating)}
          </p>
        </div>
      </div>

      {/* 统计数字 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/80 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-red-500">{analysis.harmfulCount}</div>
          <div className="text-xs text-gray-500 mt-1">有害成分</div>
        </div>
        <div className="bg-white/80 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-yellow-500">{analysis.irritantCount}</div>
          <div className="text-xs text-gray-500 mt-1">刺激成分</div>
        </div>
        <div className="bg-white/80 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">{analysis.comedogenicCount}</div>
          <div className="text-xs text-gray-500 mt-1">致痘成分</div>
        </div>
      </div>

      {/* 警告列表 */}
      {analysis.warnings.length > 0 && (
        <div className="mt-4 space-y-2">
          {analysis.warnings.map((w) => (
            <div key={w.ingredientId} className="flex items-start gap-2 bg-white/80 rounded-lg p-3 text-sm">
              <span className="shrink-0 mt-0.5">
                {w.riskLevel === 3 ? '🔴' : w.riskLevel === 2 ? '🔶' : '⚠️'}
              </span>
              <div>
                <span className="font-medium text-gray-800">{w.ingredientName}</span>
                <span className="text-gray-600"> — {w.reason}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
