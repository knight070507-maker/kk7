import { useNavigate } from 'react-router-dom';

export function PageNav() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-2 flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-neutral-800"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        返回
      </button>
      <span className="text-stone-300 dark:text-stone-700">|</span>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-neutral-800"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        首页
      </button>
    </div>
  );
}
