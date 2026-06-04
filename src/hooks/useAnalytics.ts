import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Track page views
export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    supabase.from('analytics_pageviews').insert({
      page: location.pathname,
      referrer: document.referrer || 'direct',
    }).then(({ error }) => {
      if (error) console.warn('PageView tracking error:', error.message);
    });
  }, [location.pathname]);
}

// Track searches - always tracks, regardless of results
export async function trackSearch(query: string, source: 'local' | 'ai', success: boolean, userId?: string | null) {
  if (!query || query.trim().length < 2) return;

  const { error } = await supabase.from('analytics_searches').insert({
    query: query.trim(),
    source,
    success,
    user_id: userId || null,
  });

  if (error) {
    console.warn('Search tracking error:', error.message, error.details);
  }
}
