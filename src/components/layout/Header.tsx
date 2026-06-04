import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserMenu } from '../auth/UserMenu';
import { AuthModal } from '../auth/AuthModal';
import { SearchAutocomplete } from '../common/SearchAutocomplete';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [history, setHistory] = useState<{ query: string; created_at: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = async () => {
    if (!user) return;
    const { data } = await supabase.from('search_history').select('query, created_at').order('created_at', { ascending: false }).limit(10);
    if (data) setHistory(data);
    setShowHistory(!showHistory);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-2 md:gap-4">
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-xl md:text-2xl">🧴</span>
            <span className="font-bold text-base md:text-lg text-gray-800">成分说明书</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3 text-sm text-gray-600">
            <Link to="/explore" className="hover:text-purple-600 transition-colors">🏆 精选</Link>
            <Link to="/recommend" className="hover:text-purple-600 transition-colors">🧬 肤质</Link>
            <Link to="/ingredients" className="hover:text-purple-600 transition-colors">🧪 成分</Link>
            <Link to="/stats" className="hover:text-purple-600 transition-colors">📊</Link>
            {user && (
              <button onClick={loadHistory} className="hover:text-purple-600 transition-colors relative">📜
                {showHistory && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowHistory(false)} />
                    <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-3">
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">最近搜索</h4>
                      {history.length === 0 ? <p className="text-xs text-gray-400">暂无</p> : (
                        history.map((h, i) => (
                          <button key={i} onClick={() => { navigate(`/search?q=${encodeURIComponent(h.query)}`); setShowHistory(false); }} className="w-full text-left px-2 py-1 rounded hover:bg-purple-50 text-xs text-gray-700">
                            🔍 {h.query}
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </button>
            )}
          </nav>

          {/* Search with autocomplete */}
          <SearchAutocomplete />

          <UserMenu onLoginClick={() => setShowAuth(true)} />
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            <Link to="/explore" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm font-medium">🏆 全球编辑精选</Link>
            <Link to="/recommend" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm font-medium">🧬 肤质测试推荐</Link>
            <Link to="/ingredients" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm font-medium">🧪 成分百科</Link>
            <Link to="/stats" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm font-medium">📊 统计数据</Link>
            <Link to="/search" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-purple-50 text-sm font-medium">🔍 搜索产品</Link>
          </div>
        )}
      </header>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
