-- ============================================================
-- 护肤品成分分析网站 - 数据库表结构
-- 使用方法：在 Supabase 后台 → SQL Editor → 粘贴全部 → Run
-- ============================================================

-- 1. 用户资料表（扩展 Supabase auth.users）
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 自动为新注册用户创建 profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. 搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  is_ai_result BOOLEAN DEFAULT FALSE,
  result_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AI 分析缓存表（搜过的产品下次直接返回，不重复花钱）
CREATE TABLE IF NOT EXISTS analysis_cache (
  id BIGSERIAL PRIMARY KEY,
  query TEXT NOT NULL UNIQUE,
  product_data JSONB NOT NULL,
  ingredients JSONB,
  analysis JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 设置行级安全策略 (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_cache ENABLE ROW LEVEL SECURITY;

-- profiles: 用户可读所有，只能改自己的
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- search_history: 用户只能读写自己的
CREATE POLICY "history_select" ON search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "history_insert" ON search_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "history_delete" ON search_history FOR DELETE USING (auth.uid() = user_id);

-- analysis_cache: 所有人可读（公共缓存），只能通过 Edge Function 写入
CREATE POLICY "cache_select" ON analysis_cache FOR SELECT USING (true);
