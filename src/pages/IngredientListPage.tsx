import { useState } from 'react';
import { allIngredients } from '../data/ingredients';
import { IngredientCard } from '../components/ingredient/IngredientCard';
import { SearchBar } from '../components/common/SearchBar';
import { IngredientCategory, RiskLevel } from '../types';
import { getRiskLabel } from '../utils/analysis';

export function IngredientListPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | null>(null);

  // 获取所有分类
  const categories = Object.values(IngredientCategory);

  // 过滤成分
  const filteredIngredients = allIngredients.filter((ing) => {
    if (searchText && !ing.name.toLowerCase().includes(searchText.toLowerCase()) &&
        !ing.nameEn.toLowerCase().includes(searchText.toLowerCase()) &&
        !ing.aliases.some(a => a.toLowerCase().includes(searchText.toLowerCase()))) {
      return false;
    }
    if (selectedCategory && ing.category !== selectedCategory) {
      return false;
    }
    if (selectedRisk !== null && ing.riskLevel !== selectedRisk) {
      return false;
    }
    return true;
  });

  const handleSearch = (q: string) => {
    setSearchText(q);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🧪 成分百科</h1>

      {/* 搜索 */}
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} placeholder="搜索成分名称，如「甘油」「水杨酸」..." />
      </div>

      {/* 筛选器 */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* 风险等级筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">风险：</span>
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedRisk(null)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedRisk === null
                  ? 'bg-stone-200 border-stone-400 text-stone-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-stone-300'
              }`}
            >
              全部
            </button>
            {([0, 1, 2, 3] as RiskLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedRisk(level)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedRisk === level
                    ? 'bg-stone-200 border-stone-400 text-stone-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-stone-300'
                }`}
              >
                {getRiskLabel(level)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            selectedCategory === null
              ? 'bg-stone-800 text-white border-stone-800'
              : 'bg-white border-gray-200 text-gray-600 hover:border-stone-300'
          }`}
        >
          全部分类
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              selectedCategory === cat
                ? 'bg-stone-800 text-white border-stone-800'
                : 'bg-white border-gray-200 text-gray-600 hover:border-stone-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 结果数量 */}
      <div className="text-sm text-gray-500 mb-4">
        共 {filteredIngredients.length} 种成分
      </div>

      {/* 成分列表 */}
      {filteredIngredients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIngredients.map((ing) => (
            <IngredientCard key={ing.id} ingredient={ing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-lg">没有找到匹配的成分</p>
          <p className="mt-2 text-sm">试试调整筛选条件或搜索关键词</p>
        </div>
      )}
    </div>
  );
}
