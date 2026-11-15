# Waleed's Personal Document Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, production-ready, secure personal document vault web application ("Waleed's Personal Document Hub") with Supabase Auth, PostgreSQL RLS, private bucket storage, smart search, preview modal, multi-file uploads, and an integrated professional portfolio using real assets.

**Architecture:** Client-side React 18 single-page application built with Vite, Tailwind CSS, and Lucide React. Authentication and private storage communicate directly with Supabase using `@supabase/supabase-js` under strict Row Level Security (RLS) policies. Includes an automatic inactivity session timeout, an interactive First-Run Setup Wizard with complete SQL migration scripts, and a watermarked synthetic demo mode when environment variables are not yet configured.

**Tech Stack:** React 18, Vite, Tailwind CSS, `@supabase/supabase-js`, Lucide React, PDF viewer support.

**Spec:** `docs/superpowers/specs/2026-11-15-document-vault-design.md`

## Global Constraints
- Security first: No public document storage. Supabase bucket `vault` must be private with signed short-lived URLs.
- Sensitive documents must never be committed to Git or exposed via public endpoints.
- Contact number must be updated to `0325 2774492`.
- Real portfolio assets from `portfolio_assets/` must be served in the integrated portfolio section.
- Clean `.gitignore` and `.env.example` must prevent any secret leaks.

## Review Focus
1. Storage URL leakage: Attempting to access file objects directly without a signed URL should fail with 403 Forbidden.
2. Inactivity timer: Browser tab left idle longer than the configured timeout automatically locks the vault and wipes sensitive session cache.
3. Multi-file upload failure handling: If 1 of 5 files fails validation (e.g. invalid format or size > 50MB), clear error feedback is given per file without aborting successful uploads.
4. Demo mode boundary: Synthetic demo mode must be strictly read-only or local-mock with synthetic data, never presenting itself as a secure store for real documents.
5. In-browser preview: PDFs and high-resolution images must render cleanly inside the preview modal with responsive fallback for other mime types.

---

### Task 1: Project Scaffolding, Dependencies, and Environment Configuration

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/main.jsx`
- Create: `src/index.css`
- Create: `src/App.jsx`

**Interfaces:**
- Produces: Working React + Vite + Tailwind CSS build that runs on `http://localhost:5173` without errors.

- [ ] **Step 1: Create package.json and project configuration files**
  Configure Vite, React 18, `@supabase/supabase-js`, `lucide-react`, `clsx`, `tailwind-merge`, and Tailwind CSS.
- [ ] **Step 2: Install dependencies**
  Run `npm install` and verify package lock.
- [ ] **Step 3: Setup .gitignore and .env.example**
  Ensure `.env`, `.env.local`, `node_modules`, `dist`, and sensitive uploads are ignored.
- [ ] **Step 4: Verify build and start dev server**
  Run `npm run build` to confirm zero compilation errors.

---

### Task 2: Supabase Database Schema, Storage Policies, and Migration Scripts

**Files:**
- Create: `supabase/migrations/20261115_initial_schema.sql`
- Create: `supabase/README.md`
- Create: `src/lib/supabase.js`
- Create: `src/types/database.js`

**Interfaces:**
- Consumes: Supabase credentials from `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`.
- Produces: `supabase` client instance, `isSupabaseConfigured()` helper, and complete SQL script containing `documents`, `categories`, `user_profiles`, storage bucket `vault`, and strict Row Level Security (RLS) policies.

- [ ] **Step 1: Write initial schema SQL script**
  Tables for `user_profiles`, `categories`, and `documents` with foreign keys to `auth.users(id)`.
- [ ] **Step 2: Add RLS policies for database tables**
  Policies enforcing `auth.uid() = user_id` for SELECT, INSERT, UPDATE, DELETE.
- [ ] **Step 3: Add Storage bucket policies**
  Storage policies for private bucket `vault` restricting file read/write to `auth.uid() = (storage.foldername(name))[1]`.
- [ ] **Step 4: Implement src/lib/supabase.js**
  Export initialized Supabase client and connection health check.

---

### Task 3: Security, Authentication, and Inactivity Session Management

**Files:**
- Create: `src/context/AuthContext.jsx`
- Create: `src/hooks/useInactivityTimeout.js`
- Create: `src/components/auth/LoginModal.jsx`
- Create: `src/components/auth/SetupOwnerModal.jsx`
- Create: `src/components/auth/ResetPasswordModal.jsx`
- Create: `src/components/auth/SetupGuideBanner.jsx`

**Interfaces:**
- Consumes: `supabase` from `src/lib/supabase.js`.
- Produces: `useAuth()` hook providing `{ user, session, login, signup, logout, resetPassword, isDemoMode, setDemoMode, isConfigured }`.

- [ ] **Step 1: Implement AuthContext with session persistence**
  Handle Supabase session state listener, login, signup, password recovery, and demo mode switch.
- [ ] **Step 2: Implement useInactivityTimeout hook**
  Listen to mouse, keyboard, touch events, and trigger auto-lock after user-defined inactivity duration (default 15 minutes).
- [ ] **Step 3: Create Login, Setup, and Password Recovery UI**
  Professional authentication views with loading states, error alerts, and clean layout.
- [ ] **Step 4: Create Setup Guide modal**
  Interactive guide explaining how to create a Supabase project, execute SQL migrations, and configure `.env`.

---

### Task 4: Document Vault Core - State, Storage Service, and Category Model

**Files:**
- Create: `src/constants/categories.js`
- Create: `src/services/documentService.js`
- Create: `src/context/DocumentContext.jsx`

**Interfaces:**
- Consumes: `supabase` client and `useAuth()`.
- Produces: `useDocuments()` hook providing `{ documents, categories, loading, uploadDocuments, updateDocument, deleteDocument, toggleFavorite, recordAccess, getSignedUrl, addCategory }`.

- [ ] **Step 1: Define default document categories and subcategories**
  Personal (CNIC, Domicile, PRC, Passport, etc.), Educational (Matric, Inter, University, Transcripts), University (Student card, Challans, etc.), Professional (CV, Certificates), Other.
- [ ] **Step 2: Implement documentService.js**
  File validation (size <= 50MB, allowed types), upload to private `vault` bucket, metadata insertion into `documents` table, short-lived signed URL generation (60-second validity), rename, tag update, and deletion with file cleanup.
- [ ] **Step 3: Implement DocumentContext.jsx**
  Provide reactive state, document caching, recent uploads, frequent views, and synthetic demo fallback.

---

### Task 5: Document Upload, Management, and In-Browser Preview

**Files:**
- Create: `src/components/vault/UploadModal.jsx`
- Create: `src/components/vault/DocumentViewerModal.jsx`
- Create: `src/components/vault/EditDocumentModal.jsx`
- Create: `src/components/vault/DeleteConfirmModal.jsx`
- Create: `src/components/vault/DocumentCard.jsx`
- Create: `src/components/vault/DocumentListRow.jsx`

**Interfaces:**
- Consumes: `useDocuments()` and `useAuth()`.
- Produces: Interactive UI for uploading multiple files with drag & drop, viewing PDFs/images in-browser, editing metadata/tags, and safe deletion.

- [ ] **Step 1: Implement UploadModal with drag-and-drop**
  Support single and multi-file uploads, file-type icons, category/subcategory selectors, custom tag input, description, and upload progress.
- [ ] **Step 2: Implement DocumentViewerModal**
  In-browser PDF previewer with download button, image previewer with zoom/rotate, document metadata details (size, category, tags, upload date).
- [ ] **Step 3: Implement EditDocumentModal & DeleteConfirmModal**
  Edit title, category, tags, and description. Destructive delete confirmation requiring explicit user confirmation.
- [ ] **Step 4: Implement DocumentCard & DocumentListRow**
  Responsive card and list views with badge indicators (type, size, favorite star, quick actions).

---

### Task 6: Smart Search, Filter, Sort, and Vault Dashboard

**Files:**
- Create: `src/components/vault/SearchBar.jsx`
- Create: `src/components/vault/FilterBar.jsx`
- Create: `src/components/vault/StorageUsageBar.jsx`
- Create: `src/components/vault/QuickAccessShortcuts.jsx`
- Create: `src/views/DashboardView.jsx`
- Create: `src/views/DocumentsView.jsx`

**Interfaces:**
- Consumes: `useDocuments()`.
- Produces: Dashboard view with stats, storage indicators, recent uploads, frequent views, and documents explorer with multi-criteria search and filters.

- [ ] **Step 1: Implement SearchBar with instant suggestions & history**
  Real-time query parsing matching name, category, subcategory, tags, and description. Recent search history storage.
- [ ] **Step 2: Implement FilterBar and sorting**
  Filters by category, file type (PDF, Image, Doc), favorite status. Sort by upload date (newest/oldest), title (A-Z/Z-A), size, or view count.
- [ ] **Step 3: Implement StorageUsageBar & QuickAccessShortcuts**
  Visual storage consumption meter and one-click shortcuts to key categories (CNIC, Transcripts, CV, FAST Card).
- [ ] **Step 4: Implement DashboardView and DocumentsView**
  Unified dashboard assembling metrics, recent docs, pinned items, and document grid.

---

### Task 7: Integrated Professional Portfolio & Real Asset Integration

**Files:**
- Copy: `portfolio_assets/*` -> `public/assets/portfolio/`
- Create: `src/views/PortfolioView.jsx`
- Create: `src/components/portfolio/HeroSection.jsx`
- Create: `src/components/portfolio/AboutSection.jsx`
- Create: `src/components/portfolio/SkillsSection.jsx`
- Create: `src/components/portfolio/ProjectsSection.jsx`
- Create: `src/components/portfolio/CertificatesSection.jsx`
- Create: `src/components/portfolio/ContactSection.jsx`

**Interfaces:**
- Consumes: Assets from `public/assets/portfolio/` (`waleed.png`, `Waleed_Ahmed_Resume.pdf`, `codercup.jpeg`, `waleed_coderscup.pdf`, `procom.jpeg`, `waleed_procom26.pdf`, `developerday.jpeg`, `waleed_developersday.pdf`).
- Produces: Rich, professional portfolio view integrated into the app navigation, featuring Waleed Ahmed Siddiqui, 19, BS Data Science at FAST-NUCES Karachi, updated contact number `0325 2774492`, skills, education, project gallery, and certificates with real download links.

- [ ] **Step 1: Move and verify portfolio assets**
  Copy downloaded assets into `public/assets/portfolio/` and ensure file accessibility.
- [ ] **Step 2: Build Hero, About, and Skills sections**
  Featuring accurate bio, FAST BS Data Science profile, and skills.
- [ ] **Step 3: Build Projects and Education sections**
  Cards for Election System, Portfolio, Imtiaz Website, Car Marketplace, Smart Traffic Simulator, and Responsive Webpage.
- [ ] **Step 4: Build Certificates & Contact sections**
  Direct preview and download buttons for ACM Coder's Cup, PROCOM 26, Developer's Day, and updated contact: `0325 2774492`.

---

### Task 8: Navigation, Layout, Settings, and End-to-End Testing

**Files:**
- Create: `src/components/layout/Sidebar.jsx`
- Create: `src/components/layout/Header.jsx`
- Create: `src/views/SettingsView.jsx`
- Modify: `src/App.jsx`
- Create: `src/test/vault.test.js` or automated validation script

**Interfaces:**
- Consumes: All views and contexts.
- Produces: Responsive collapsible sidebar navigation, header with search and user controls, settings panel (password change, inactivity timer, session management, storage stats), and full application verification.

- [ ] **Step 1: Implement responsive Sidebar and Header**
  Collapsible navigation for Dashboard, All Documents, Categories, Favorites, Recently Viewed, About Me (Portfolio), and Settings.
- [ ] **Step 2: Implement SettingsView**
  Change password, inactivity timeout selector (5m, 15m, 30m, 1h), session details, storage breakdown, Supabase status.
- [ ] **Step 3: Assemble App.jsx with route/view switching and guards**
  Ensure unauthenticated visitors cannot access document views, while providing smooth login and setup workflows.
- [ ] **Step 4: Build, execute tests, and verify all core flows**
  Run Vite production build, verify zero lint/syntax errors, verify assets, test search, filter, and upload simulation.
