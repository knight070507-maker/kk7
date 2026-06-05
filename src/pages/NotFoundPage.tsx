import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <span className="text-7xl">🔍</span>
      <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-2">404</h1>
      <p className="text-gray-500 mb-2">这个页面不存在</p>
      <p className="text-sm text-gray-400 mb-8">可能链接已失效或地址输入有误</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">
          ← 返回上一页
        </button>
        <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors text-sm font-medium">
          🏠 回首页
        </button>
      </div>
    </div>
  );
}
