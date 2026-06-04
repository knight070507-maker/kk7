import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface AnalysisRequest {
  id: string;
  productName: string;
  brand: string;
  submittedAt: string;
  status: 'pending' | 'analyzing' | 'completed';
}

export function RequestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';

  const [productName, setProductName] = useState(initialQuery);
  const [brand, setBrand] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState<AnalysisRequest[]>([]);

  // 加载已有的申请
  useEffect(() => {
    const saved = localStorage.getItem('analysis-requests');
    if (saved) {
      setRequests(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    const newRequest: AnalysisRequest = {
      id: Date.now().toString(),
      productName: productName.trim(),
      brand: brand.trim() || '未填写',
      submittedAt: new Date().toLocaleDateString('zh-CN'),
      status: 'pending',
    };

    const updated = [newRequest, ...requests];
    setRequests(updated);
    localStorage.setItem('analysis-requests', JSON.stringify(updated));
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-purple-600 mb-4 inline-flex items-center gap-1">
        ← 返回
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">📝 申请分析产品</h1>
      <p className="text-gray-500 mb-8">
        数据库里没找到你要的产品？提交申请，我们会尽快分析它的成分。
      </p>

      {/* 提交表单 */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              产品名称 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="例如：兰蔻小黑瓶精华"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              品牌名称
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="例如：Lancôme 兰蔻"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
          >
            🚀 提交申请
          </button>
        </form>
      ) : (
        <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-200">
          <span className="text-5xl">🎉</span>
          <h3 className="text-xl font-bold text-green-700 mt-4 mb-2">申请已提交！</h3>
          <p className="text-green-600 mb-4">
            我们收到了你对「{productName}」的分析申请。
          </p>
          <p className="text-sm text-green-500 mb-6">
            产品分析通常需要1-3个工作日。我们会尽快处理并收录到数据库中。
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setProductName(''); setBrand(''); }}
              className="px-5 py-2.5 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium"
            >
              📝 再申请一个
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
            >
              🏠 返回首页
            </button>
          </div>
        </div>
      )}

      {/* 申请列表 */}
      {requests.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📋 你的申请记录（{requests.length}）
          </h2>
          <div className="space-y-2">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                <div>
                  <span className="font-medium text-gray-800">{req.productName}</span>
                  <span className="text-xs text-gray-400 ml-2">{req.brand}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{req.submittedAt}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    req.status === 'completed' ? 'bg-green-100 text-green-700' :
                    req.status === 'analyzing' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {req.status === 'completed' ? '✅ 已收录' :
                     req.status === 'analyzing' ? '🔬 分析中' : '⏳ 排队中'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 说明 */}
      <div className="mt-10 p-6 bg-purple-50 rounded-2xl border border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-3">💡 关于产品分析</h3>
        <div className="space-y-2 text-sm text-purple-700">
          <p>📊 <strong>我们怎么分析？</strong> 通过查询公开成分数据库和品牌官方信息，获取产品的完整成分表。</p>
          <p>🧪 <strong>每个成分都会：</strong> 标注风险等级、解释对皮肤的作用、说明适合什么肤质。</p>
          <p>🔍 <strong>双重验证：</strong> 数据来源 + 人工复核，确保不胡编乱造。</p>
          <p>📝 <strong>分析结果：</strong> 和现有产品一样的格式——适合肤质、针对问题、优缺点、性价比评价。</p>
        </div>
      </div>
    </div>
  );
}
