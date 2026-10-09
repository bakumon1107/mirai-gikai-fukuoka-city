-- Supabase Security Advisor の "Security Definer View" 指摘への対応
-- ビューは既定で作成者（postgres）権限で実行され、元テーブルの RLS を
-- すり抜けて anon / authenticated から jimu_jigyo_items 等が読めてしまう。
-- security_invoker を有効にし、呼び出し元の権限・RLS で評価させる。
-- アプリは createAdminClient()（Service Role）経由でアクセスするため影響なし。
ALTER VIEW jimu_jigyo_latest SET (security_invoker = true);
ALTER VIEW jimu_jigyo_budget_timeline SET (security_invoker = true);
