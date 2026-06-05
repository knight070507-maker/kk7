import { Link } from 'react-router-dom';

const links = [
  { title: '查找', items: [{ label: '搜索产品', to: '/search' }, { label: '成分百科', to: '/ingredients' }, { label: '产品对比', to: '/compare' }] },
  { title: '推荐', items: [{ label: '肤质测试', to: '/recommend' }, { label: '编辑精选', to: '/explore' }] },
  { title: '数据', items: [{ label: '网站统计', to: '/stats' }, { label: '申请分析', to: '/request' }] },
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-neutral-800 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-8 mb-10">
          {links.map(col => (
            <div key={col.title}>
              <h4 className="text-[11px] tracking-[0.1em] uppercase text-stone-400 dark:text-stone-500 mb-3 font-medium">{col.title}</h4>
              {col.items.map(item => (
                <Link key={item.to} to={item.to} className="block text-sm text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 mb-1.5 font-light transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <div>
            <h4 className="text-[11px] tracking-[0.1em] uppercase text-stone-400 dark:text-stone-500 mb-3 font-medium">关于</h4>
            <p className="text-sm text-stone-600 dark:text-stone-400 font-light">成分说明书 v2.0<br />用最简单的话看懂护肤品</p>
          </div>
        </div>
        <div className="text-center pt-6 border-t border-stone-200 dark:border-neutral-800 text-xs text-stone-400 dark:text-stone-600 font-light">
          本网站成分信息仅供参考，不构成医疗建议。如有皮肤问题请咨询专业医生。
        </div>
      </div>
    </footer>
  );
}
