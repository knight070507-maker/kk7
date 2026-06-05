import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productDB } from '../../data/products';
import { allIngredients } from '../../data/ingredients';

export function SearchAutocomplete() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const suggestions = text.trim().length >= 2
    ? [
        ...productDB.filter(p => p.name.toLowerCase().includes(text.toLowerCase()) || p.brand.toLowerCase().includes(text.toLowerCase())).slice(0, 4).map(p => ({ type: '', label: p.name, sub: p.brand, path: `/product/${p.id}` })),
        ...allIngredients.filter(i => i.name.includes(text) || i.nameEn.toLowerCase().includes(text.toLowerCase())).slice(0, 3).map(i => ({ type: '', label: i.name, sub: i.nameEn, path: `/ingredient/${i.id}` })),
      ].slice(0, 6)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) { navigate(`/search?q=${encodeURIComponent(text.trim())}`); setShow(false); }
  };

  return (
    <div ref={ref} className="relative flex-1 max-w-sm">
      <form onSubmit={handleSubmit}>
        <input type="text" value={text} onChange={e => { setText(e.target.value); setShow(true); }}
          onFocus={() => setShow(true)} placeholder="搜索产品或成分..."
          className="w-full px-3 py-2 text-sm rounded-full border border-gray-300 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 outline-none transition-all" />
      </form>
      {show && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => { navigate(s.path); setShow(false); setText(''); }}
              className="w-full text-left px-4 py-2.5 hover:bg-stone-100 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0">
              <span className="text-lg">{s.type}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{s.label}</p>
                <p className="text-xs text-gray-400 truncate">{s.sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
