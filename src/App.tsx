import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { IngredientDetailPage } from './pages/IngredientDetailPage';
import { IngredientListPage } from './pages/IngredientListPage';
import { RequestPage } from './pages/RequestPage';
import { StatsPage } from './pages/StatsPage';
import { RecommendPage } from './pages/RecommendPage';
import { ExplorePage } from './pages/ExplorePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="ingredient/:id" element={<IngredientDetailPage />} />
            <Route path="ingredients" element={<IngredientListPage />} />
            <Route path="request" element={<RequestPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="recommend" element={<RecommendPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
