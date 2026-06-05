import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuProps {
  onLoginClick: () => void;
}

export function UserMenu({ onLoginClick }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-full transition-colors"
      >
        登录
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-stone-500 flex items-center justify-center text-white text-xs font-bold">
          {user.email?.[0].toUpperCase() || '👤'}
        </div>
        <span className="text-sm text-gray-700 hidden md:inline max-w-[100px] truncate">
          {user.email?.split('@')[0]}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
            </div>
            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              退出登录
            </button>
          </div>
        </>
      )}
    </div>
  );
}
