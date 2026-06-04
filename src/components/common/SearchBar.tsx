import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  large?: boolean;
}

export function SearchBar({ onSearch, placeholder = '搜索产品名称或成分名称...', initialValue = '', large = false }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-5 ${large ? 'pr-28' : 'pr-24'} ${
            large ? 'py-4 text-lg' : 'py-3 text-base'
          } rounded-2xl border-2 border-gray-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all shadow-sm`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 ${
            large ? 'px-6 py-2 text-base' : 'px-5 py-1.5 text-sm'
          } bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-colors`}
        >
          🔍 搜索
        </button>
      </div>
    </form>
  );
}
