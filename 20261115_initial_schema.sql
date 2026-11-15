-- ==============================================================================
-- WALEED'S PERSONAL DOCUMENT HUB - HARDENED PRODUCTION SCHEMA & RLS POLICIES
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query).
-- Baseline Setup: CREATE TABLE IF NOT EXISTS initializes baseline schemas.
-- (Note: CREATE TABLE IF NOT EXISTS does not alter pre-existing column types or
-- constraints; explicit ALTER TABLE migrations are used for schema upgrades).
-- Idempotent: Drops and recreates all security policies and triggers cleanly.
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. Vault Security Configuration
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.vault_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS and lock down vault_settings (No direct client access)
ALTER TABLE public.vault_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vault_settings FROM PUBLIC;
REVOKE ALL ON public.vault_settings FROM anon;
REVOKE ALL ON public.vault_settings FROM authenticated;

-- Set the designated vault owner email. Only this email can initialize the vault.
INSERT INTO public.vault_settings (key, value, description)
VALUES 
    ('authorized_owner_email', 'wa006514@gmail.com', 'Designated email authorized to register as vault owner')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = now();

-- ==============================================================================
-- 3. User Profiles Table (Linked to Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT DEFAULT 'Waleed Ahmed Siddiqui',
    avatar_url TEXT,
    inactivity_timeout_minutes INTEGER DEFAULT 15,
    is_owner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Explicitly revoke all table-wide permissions
REVOKE ALL ON public.user_profiles FROM PUBLIC;
REVOKE ALL ON public.user_profiles FROM anon;
REVOKE ALL ON public.user_profiles FROM authenticated;

-- Principle of Least Privilege:
-- Grant SELECT on all columns, but strictly restrict UPDATE to non-sensitive columns only.
-- Authenticated users CANNOT update id, email, or is_owner. No direct INSERT or DELETE.
GRANT SELECT ON public.user_profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url, inactivity_timeout_minutes) ON public.user_profiles TO authenticated;

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Clean up any legacy or duplicate policies that could weaken security
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.user_profiles;

-- Idempotent RLS Policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Defense-in-depth: Trigger to prevent tampering with immutable profile fields
-- Hardened with SET search_path = '' and fully qualified database objects
CREATE OR REPLACE FUNCTION public.protect_user_profile_fields()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
    -- Use IS DISTINCT FROM to safely handle comparisons including potential NULLs
    IF NEW.id IS DISTINCT FROM OLD.id THEN
        RAISE EXCEPTION 'Security Violation: Profile ID cannot be altered.';
    END IF;

    IF NEW.email IS DISTINCT FROM OLD.email THEN
        RAISE EXCEPTION 'Security Violation: Profile email must match auth record.';
    END IF;

    IF NEW.is_owner IS DISTINCT FROM OLD.is_owner THEN
        RAISE EXCEPTION 'Security Violation: Privilege escalation attempt. Ownership flag is immutable.';
    END IF;

    NEW.updated_at = pg_catalog.now();
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_user_profile_fields() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.protect_user_profile_fields() FROM anon;
GRANT EXECUTE ON FUNCTION public.protect_user_profile_fields() TO authenticated;

DROP TRIGGER IF EXISTS trigger_protect_user_profile_fields ON public.user_profiles;
CREATE TRIGGER trigger_protect_user_profile_fields
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_user_profile_fields();

-- ==============================================================================
-- 4. Document Categories Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon TEXT DEFAULT 'Folder',
    color TEXT DEFAULT 'blue',
    subcategories JSONB DEFAULT '[]'::jsonb,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Explicitly revoke all permissions before granting required CRUD
REVOKE ALL ON public.categories FROM PUBLIC;
REVOKE ALL ON public.categories FROM anon;
REVOKE ALL ON public.categories FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own and system categories" ON public.categories;
CREATE POLICY "Users can view their own and system categories"
    ON public.categories FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR is_system = true);

DROP POLICY IF EXISTS "Users can insert their own custom categories" ON public.categories;
CREATE POLICY "Users can insert their own custom categories"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id AND is_system = false);

DROP POLICY IF EXISTS "Users can update their own custom categories" ON public.categories;
CREATE POLICY "Users can update their own custom categories"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND is_system = false)
    WITH CHECK (auth.uid() = user_id AND is_system = false);

DROP POLICY IF EXISTS "Users can delete their own custom categories" ON public.categories;
CREATE POLICY "Users can delete their own custom categories"
    ON public.categories FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id AND is_system = false);

-- Seed standard system categories (Idempotent)
INSERT INTO public.categories (id, user_id, name, slug, icon, color, is_system, subcategories)
VALUES
    ('00000000-0000-0000-0000-000000000001', NULL, 'Personal Documents', 'personal', 'UserCheck', 'emerald', true, '["CNIC (Front)", "CNIC (Back)", "CNIC (Combined)", "Birth Certificate", "Domicile", "PRC (Permanent Residence Certificate)", "Passport", "Other Personal Documents"]'::jsonb),
    ('00000000-0000-0000-0000-000000000002', NULL, 'Educational Documents', 'educational', 'GraduationCap', 'blue', true, '["Matric Marksheet", "Matric Certificate", "Intermediate Part-I Marksheet", "Intermediate Part-II Marksheet", "Intermediate Certificate", "University Admission Letter", "University Enrollment Documents", "Semester-wise Transcripts", "Semester Result Cards", "Other Academic Records"]'::jsonb),
    ('00000000-0000-0000-0000-000000000003', NULL, 'University Documents', 'university', 'School', 'indigo', true, '["FAST University Student Card", "Fee Challans and Receipts", "University Letters", "Course Registration Documents", "Timetables", "Assignments and Academic Records", "Other University Records"]'::jsonb),
    ('00000000-0000-0000-0000-000000000004', NULL, 'Professional Documents', 'professional', 'Briefcase', 'amber', true, '["Updated CV / Resume", "Internship Certificates", "Experience Letters", "Skills Certificates", "Competition Certificates", "Training Certificates", "Other Professional Achievements"]'::jsonb),
    ('00000000-0000-0000-0000-000000000005', NULL, 'Other Documents', 'other', 'FolderArchive', 'slate', true, '["General PDFs", "Important Forms", "Scanned Receipts", "Miscellaneous Files"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    subcategories = EXCLUDED.subcategories,
    is_system = true;

-- ==============================================================================
-- 5. Documents Table (Owner-Isolated Vault Metadata & Strict Path Validation)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Strict Format: {user_id}/{document_id}/{filename}
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    category_name TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    description TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Explicitly revoke all permissions before granting required CRUD
REVOKE ALL ON public.documents FROM PUBLIC;
REVOKE ALL ON public.documents FROM anon;
REVOKE ALL ON public.documents FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Clean up any legacy or duplicate policies
DROP POLICY IF EXISTS "Allow all authenticated users access" ON public.documents;
DROP POLICY IF EXISTS "Allow public read access" ON public.documents;
DROP POLICY IF EXISTS "Users can manage documents" ON public.documents;

-- Documents RLS with Strict Path Isolation:
-- Enforces that file_path MUST match '{auth.uid()}/{id}/...' and contain no '.' or '..' segments.
DROP POLICY IF EXISTS "Owner can view own documents" ON public.documents;
CREATE POLICY "Owner can view own documents"
    ON public.documents FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owner can insert own documents" ON public.documents;
CREATE POLICY "Owner can insert own documents"
    ON public.documents FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id AND
        file_path LIKE (auth.uid()::text || '/' || id::text || '/%') AND
        file_path !~ '(^|/)(\.\.?)(/|$)'
    );

DROP POLICY IF EXISTS "Owner can update own documents" ON public.documents;
CREATE POLICY "Owner can update own documents"
    ON public.documents FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id AND
        file_path LIKE (auth.uid()::text || '/' || id::text || '/%') AND
        file_path !~ '(^|/)(\.\.?)(/|$)'
    );

DROP POLICY IF EXISTS "Owner can delete own documents" ON public.documents;
CREATE POLICY "Owner can delete own documents"
    ON public.documents FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Performance & Query Indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_favorite ON public.documents(is_favorite);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON public.documents USING GIN(tags);

-- ==============================================================================
-- 6. Trigger: Updated At Auto-Handler (SECURITY INVOKER)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY INVOKER 
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = pg_catalog.now();
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM anon;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated;

DROP TRIGGER IF EXISTS trigger_documents_updated_at ON public.documents;
CREATE TRIGGER trigger_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 7. Trigger: Verified-Only Owner Initialization & Concurrency Lock
-- ==============================================================================
-- Hardened with:
--   1. SET search_path = ''
--   2. Explicit pg_catalog qualifications
--   3. Transaction-level advisory lock (pg_advisory_xact_lock)
--   4. Verified-only check (relies strictly on NEW.email_confirmed_at IS NOT NULL)
--   5. Fail-closed owner email validation (wa006514@gmail.com)
--   6. Duplicate profile idempotency check
--   7. Core SQL COALESCE expression
--   8. Revocation of client EXECUTE privileges
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
DECLARE
    existing_owner_count pg_catalog.int4;
    configured_owner_email pg_catalog.text;
BEGIN
    -- 1. Authoritative Email Verification Check
    -- Never trust client-supplied metadata (e.g. raw_user_meta_data).
    -- For both email/password registration and OAuth providers (such as GitHub),
    -- Supabase GoTrue sets email_confirmed_at when the email is legitimately verified.
    -- If email_confirmed_at is NULL, the account is unverified; exit immediately
    -- without creating a profile or locking owner registration.
    IF NEW.email_confirmed_at IS NULL THEN
        RETURN NEW;
    END IF;

    -- 2. Idempotency Check: Do not create duplicate profile if user already has one
    IF EXISTS (
        SELECT 1 
        FROM public.user_profiles 
        WHERE id = NEW.id
    ) THEN
        RETURN NEW;
    END IF;

    -- 3. Prevent concurrent owner initialization via transaction-level advisory lock
    PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('vault_owner_initialization_lock'::pg_catalog.text));

    -- 4. Check if an active owner profile already exists
    SELECT pg_catalog.count(*) INTO existing_owner_count 
    FROM public.user_profiles 
    WHERE is_owner = TRUE;

    -- If the vault owner is already registered, reject any further signups immediately
    IF existing_owner_count > 0 THEN
        RAISE EXCEPTION 'Vault Registration Locked: An owner account is already registered for this document hub. Additional user registrations are permanently disabled.';
    END IF;

    -- 5. Fail-Closed Validation of Registration Email
    IF NEW.email IS NULL THEN
        RAISE EXCEPTION 'Access Denied: Registration email cannot be null.';
    END IF;

    -- 6. Fail-Closed Validation of Authorized Owner Email Setting
    SELECT value INTO configured_owner_email
    FROM public.vault_settings
    WHERE key = 'authorized_owner_email';

    IF configured_owner_email IS NULL THEN
        RAISE EXCEPTION 'Access Denied: Vault security configuration error. Authorized owner email is not configured in settings.';
    END IF;

    -- Compare emails case-insensitively using IS DISTINCT FROM
    IF pg_catalog.lower(NEW.email) IS DISTINCT FROM pg_catalog.lower(configured_owner_email) THEN
        RAISE EXCEPTION 'Access Denied: Registration is restricted exclusively to the pre-authorized vault owner (%). Attempted email (%) is not authorized.', configured_owner_email, NEW.email;
    END IF;

    -- 7. Register the single verified owner
    INSERT INTO public.user_profiles (id, email, full_name, is_owner)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Waleed Ahmed Siddiqui'),
        TRUE
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Restrict function execution: Only the Supabase internal auth system should invoke this trigger
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;

-- Trigger on auth.users for both initial INSERT and subsequent email verification UPDATE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 8. Supabase Private Storage Bucket: 'vault'
-- ==============================================================================
-- Ensure the private bucket exists and is strictly non-public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'vault',
    'vault',
    false, -- STRICTLY PRIVATE: No direct public access. Signed tokens required.
    52428800, -- 50 MB file size limit
    ARRAY[
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 52428800,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 9. Storage Row Level Security (RLS) Policies on storage.objects
-- ==============================================================================
-- Storage path convention: {user_id}/{document_id}/{filename}
-- Enforces:
--   - bucket_id = 'vault'
--   - Root folder strictly matches auth.uid()
--   - Rejection of path segments equal to '.' or '..' via regex: !~ '(^|/)(\.\.?)(/|$)'

-- Drop common legacy or duplicate storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual insert access" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual update access" ON storage.objects;
DROP POLICY IF EXISTS "Allow individual delete access" ON storage.objects;

-- INSERT: Must use WITH CHECK
DROP POLICY IF EXISTS "Authenticated users can upload to own vault folder" ON storage.objects;
CREATE POLICY "Authenticated users can upload to own vault folder"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'vault' AND
        (storage.foldername(name))[1] = auth.uid()::text AND
        name LIKE (auth.uid()::text || '/%') AND
        name !~ '(^|/)(\.\.?)(/|$)'
    );

-- SELECT: Only allow authenticated owner to read their own vault files via signed URLs
DROP POLICY IF EXISTS "Authenticated users can read own vault files" ON storage.objects;
CREATE POLICY "Authenticated users can read own vault files"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'vault' AND
        (storage.foldername(name))[1] = auth.uid()::text AND
        name LIKE (auth.uid()::text || '/%') AND
        name !~ '(^|/)(\.\.?)(/|$)'
    );

-- UPDATE: Validate both existing row (USING) and updated row (WITH CHECK)
DROP POLICY IF EXISTS "Authenticated users can update own vault files" ON storage.objects;
CREATE POLICY "Authenticated users can update own vault files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'vault' AND
        (storage.foldername(name))[1] = auth.uid()::text AND
        name LIKE (auth.uid()::text || '/%') AND
        name !~ '(^|/)(\.\.?)(/|$)'
    )
    WITH CHECK (
        bucket_id = 'vault' AND
        (storage.foldername(name))[1] = auth.uid()::text AND
        name LIKE (auth.uid()::text || '/%') AND
        name !~ '(^|/)(\.\.?)(/|$)'
    );

-- DELETE: Only allow authenticated owner to delete their own vault files
DROP POLICY IF EXISTS "Authenticated users can delete own vault files" ON storage.objects;
CREATE POLICY "Authenticated users can delete own vault files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'vault' AND
        (storage.foldername(name))[1] = auth.uid()::text AND
        name LIKE (auth.uid()::text || '/%') AND
        name !~ '(^|/)(\.\.?)(/|$)'
    );
