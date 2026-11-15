-- ==============================================================================
-- WALEED'S PERSONAL DOCUMENT HUB - ATOMIC DOCUMENT ACCESS COUNTER RPC
-- ==============================================================================
-- Function: record_document_access(p_document_id UUID)
-- Purpose: Atomically increments view_count and updates last_accessed_at in a single
--          transaction, eliminating read-modify-write race conditions.
-- Security: SECURITY INVOKER with SET search_path = ''.
--           Enforces auth.uid() = user_id and respects existing documents RLS policies.
-- Idempotent: Can be safely re-run without errors.
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.record_document_access(p_document_id pg_catalog.uuid)
RETURNS public.documents
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_updated_doc public.documents;
BEGIN
    -- 1. Explicit authentication check
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Access Denied: Authentication required to record document access.';
    END IF;

    -- 2. Parameter validation
    IF p_document_id IS NULL THEN
        RAISE EXCEPTION 'Invalid Parameter: Document ID cannot be null.';
    END IF;

    -- 3. Atomic counter increment and timestamp update
    -- Strictly isolated to the owning user via auth.uid() = user_id and documents RLS
    UPDATE public.documents
    SET 
        view_count = COALESCE(view_count, 0) + 1,
        last_accessed_at = pg_catalog.now()
    WHERE id = p_document_id
      AND user_id = auth.uid()
    RETURNING * INTO v_updated_doc;

    -- 4. Fail if document does not exist or belongs to another user
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Access Denied: Document not found or access restricted.';
    END IF;

    RETURN v_updated_doc;
END;
$$;

-- Explicit privilege configuration
REVOKE ALL ON FUNCTION public.record_document_access(pg_catalog.uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_document_access(pg_catalog.uuid) FROM anon;
REVOKE ALL ON FUNCTION public.record_document_access(pg_catalog.uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.record_document_access(pg_catalog.uuid) TO authenticated;
