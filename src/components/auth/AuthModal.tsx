import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = isLogin ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (!isLogin) {
      setSuccess('注册成功！请查看邮箱确认链接。');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isLogin ? '登录' : '注册'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {error && (
          <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mb-3 p-3 bg-green-50 text-green-600 text-sm rounded-lg">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱地址" required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 outline-none text-sm"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="密码（至少6位）" required minLength={6}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 outline-none text-sm"
          />
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 disabled:bg-stone-400 text-white font-bold rounded-xl transition-colors"
          >
            {loading ? '请稍候...' : isLogin ? '登录' : '注册'}
          </button>
        </form>

        {isLogin && (
          <p className="mt-2 text-center text-xs text-gray-400">
            忘记密码？请在 Supabase 后台重置，或联系网站管理员。
          </p>
        )}
        <p className="mt-3 text-center text-sm text-gray-500">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            className="ml-1 text-stone-700 hover:text-stone-700 font-medium"
          >
            {isLogin ? '立即注册' : '去登录'}
          </button>
        </p>
      </div>
    </div>
  );
}
