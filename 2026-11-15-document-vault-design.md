# Waleed's Personal Document Hub - System Design Specification

## 1. Executive Summary & Goals
Waleed's Personal Document Hub is a private, secure personal document vault built for Waleed Ahmed Siddiqui (BS Data Science student at FAST-NUCES Karachi) with an integrated professional portfolio section.

### Core Goals:
1. **Security & Privacy First**: Zero public access to personal documents. Supabase Private Storage (`vault` bucket) with Row Level Security (RLS) and short-lived signed URLs.
2. **First-Owner Authentication & Inactivity Protection**: Only authorized owner access. Password setup, login, logout, password recovery, session timeout / auto-logout after inactivity.
3. **Comprehensive Document Lifecycle**:
   - Single & batch drag-and-drop file upload with validation (PDF, JPG, PNG, DOCX, etc.).
   - Pre-populated standard categories (Personal, Educational, University, Professional, Other) and customizable user categories/subcategories.
   - Full document management: view/download, preview (PDF & Image viewer modal), rename, update category/tags/description, toggle favorites, and safe delete with confirmation.
4. **Smart Search & Discovery**:
   - Instant query search across titles, categories, tags, and descriptions.
   - Filter by category, file type, favorites, and date range.
   - Sort by date, name, size, or popularity.
   - Search suggestions, recent searches, and stats (total docs, categories, storage used, recently uploaded, frequently accessed).
5. **Integrated Portfolio & Profile**:
   - Integrated About Me page featuring Waleed Ahmed Siddiqui's biography, education, skills, projects, and certificates with genuine downloadable netlify assets (`waleed.png`, `Waleed_Ahmed_Resume.pdf`, certificate PDFs/images).
   - Updated contact: `0325 2774492`.
6. **Graceful Zero-Config Mode & Setup Wizard**:
   - If Supabase environment variables are missing, displays an interactive Setup Wizard with complete SQL migration scripts and instructions, plus an isolated Synthetic Demo Mode with mock placeholder documents.

---

## 2. Architecture & Data Flow

```
[ Browser Client (React + Vite + Tailwind + Lucide) ]
         |
         +--> [ Inactivity Monitor & Session Guard ]
         |
         +--> [ Supabase Client (@supabase/supabase-js) ]
                   |
                   +--> [ Supabase Auth ] (JWT Session, Password Reset, Owner Check)
                   |
                   +--> [ PostgreSQL Database with Strict RLS ]
                   |         - `documents` (RLS: `auth.uid() = user_id`)
                   |         - `categories` (RLS: `auth.uid() = user_id`)
                   |         - `user_profiles` (RLS: `auth.uid() = id`)
                   |
                   +--> [ Private Storage Bucket (`vault`) ]
                             (Restricted access via signed URLs only)
```

---

## 3. Database Schema & Row Level Security

### Tables:
- `user_profiles`:
  - `id` (UUID, PK, references `auth.users(id)` ON DELETE CASCADE)
  - `email` (TEXT)
  - `full_name` (TEXT)
  - `avatar_url` (TEXT)
  - `created_at` (TIMESTAMPTZ)
- `categories`:
  - `id` (UUID, PK, default `gen_random_uuid()`)
  - `user_id` (UUID, references `auth.users(id)`)
  - `name` (TEXT)
  - `slug` (TEXT)
  - `icon` (TEXT)
  - `subcategories` (JSONB / TEXT[])
  - `is_system` (BOOLEAN)
  - `created_at` (TIMESTAMPTZ)
- `documents`:
  - `id` (UUID, PK, default `gen_random_uuid()`)
  - `user_id` (UUID, references `auth.users(id)`)
  - `title` (TEXT)
  - `original_filename` (TEXT)
  - `file_path` (TEXT - path in private `vault` bucket)
  - `file_size` (BIGINT)
  - `file_type` (TEXT)
  - `category_id` (UUID, references `categories(id)` ON DELETE RESTRICT)
  - `category_name` (TEXT)
  - `subcategory` (TEXT)
  - `tags` (TEXT[])
  - `description` (TEXT)
  - `is_favorite` (BOOLEAN, default false)
  - `view_count` (INT, default 0)
  - `last_accessed_at` (TIMESTAMPTZ)
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

### Storage Bucket:
- Name: `vault` (Public: `false`)
- Objects Path: `{user_id}/{document_id}/{filename}`
- Signed URL expiration: 60 seconds.

---

## 4. UI/UX & Component Structure
- **Layout**: Collapsible sidebar, top search & status bar, dark navy/slate theme with crisp typography.
- **Views**:
  - `Dashboard`: Storage gauge, document counts, quick access, recent uploads, frequent views, search shortcuts.
  - `All Documents / Category Views`: Filter bar, sort dropdown, grid/list view switcher, document cards with badges.
  - `Upload Modal / Dropzone`: Multi-file drag & drop, file preview thumbnails, category selector, tags input, progress indicators.
  - `Document Viewer Modal`: In-browser PDF renderer (fullscreen option, zoom), image viewer (zoom, pan, rotate), file metadata sidebar, download button.
  - `Edit / Delete Modal`: Rename title, update category/subcat, manage tags, destructive delete with confirmation prompt.
  - `About Me / Portfolio`: Profile hero, education timeline, skill pills, project showcase cards, certificate gallery with direct downloads.
  - `Settings & Security`: Inactivity timeout duration, change password, Supabase connection status, storage info, session logout.
  - `Setup Wizard / Demo Banner`: Displays connection guides and SQL migrations when `.env` is unconfigured.
