-- set_active_council_session() の権限修正（Security Advisor 0028/0029 対応）
-- SECURITY DEFINER のため、anon キーだけで /rest/v1/rpc/set_active_council_session
-- を叩いて公開サイトの「現在の会期」を切り替えられる状態だった。
-- admin は createAdminClient()（Service Role）経由で呼ぶため影響なし。
-- Supabase の ALTER DEFAULT PRIVILEGES により anon/authenticated にも
-- EXECUTE が自動付与されるため、PUBLIC に加えて明示的に REVOKE する。
REVOKE EXECUTE ON FUNCTION public.set_active_council_session(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_active_council_session(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.set_active_council_session(uuid) FROM authenticated;
