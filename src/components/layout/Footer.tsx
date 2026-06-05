import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3">🔍 查找</h4>
            <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/search" className="block hover:text-purple-600">搜索产品</Link>
              <Link to="/ingredients" className="block hover:text-purple-600">成分百科</Link>
              <Link to="/compare" className="block hover:text-purple-600">产品对比</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3">🧬 推荐</h4>
            <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/recommend" className="block hover:text-purple-600">肤质测试</Link>
              <Link to="/explore" className="block hover:text-purple-600">编辑精选</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3">📊 数据</h4>
            <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/stats" className="block hover:text-purple-600">网站统计</Link>
              <Link to="/request" className="block hover:text-purple-600">申请分析</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3">🧴 关于</h4>
            <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
              <p>成分说明书 v2.0</p>
              <p>用最简单的话看懂护肤品</p>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p>本网站成分信息仅供参考，不构成医疗建议。如有皮肤问题请咨询专业医生。</p>
        </div>
      </div>
    </footer>
  );
}
