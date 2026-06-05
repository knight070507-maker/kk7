import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserMenu } from '../auth/UserMenu';
import { AuthModal } from '../auth/AuthModal';
import { SearchAutocomplete } from '../common/SearchAutocomplete';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-stone-50/90 dark:bg-neutral-900/90 backdrop-blur-xl border-stone-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-3 md:gap-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 no-underline text-stone-800 dark:text-stone-200">
            <span className="font-semibold text-sm md:text-base tracking-tight">成分说明书</span>
            <span className="text-[10px] opacity-30 hidden md:inline font-medium tracking-widest">INCI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5 text-[13px] text-stone-500 dark:text-stone-400">
            <Link to="/explore" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">精选</Link>
            <Link to="/recommend" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">肤质</Link>
            <Link to="/ingredients" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">成分</Link>
            <Link to="/compare" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">对比</Link>
          </nav>

          {/* Search */}
          <SearchAutocomplete />

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={toggle} className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-neutral-800 transition-colors text-sm" title="切换主题">
              {theme === 'dark' ? '◑' : '◐'}
            </button>
            <UserMenu onLoginClick={() => setShowAuth(true)} />
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-200 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-900 px-4 py-3 space-y-1">
            {['精选', '肤质', '成分', '对比', '统计'].map((label, i) => (
              <Link key={label} to={['/explore', '/recommend', '/ingredients', '/compare', '/stats'][i]}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-neutral-800">
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
