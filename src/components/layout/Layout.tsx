import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { usePageView } from '../../hooks/useAnalytics';
import { PageNav } from './PageNav';

export function Layout() {
  usePageView();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-neutral-950">
      <Header />
      {!isHome && <PageNav />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
