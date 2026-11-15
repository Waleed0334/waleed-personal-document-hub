# Supabase Setup Guide for Waleed's Personal Document Hub

This guide walks you through setting up your private Supabase database and secure storage vault.

---

## 1. Designated Owner Security Model
In `supabase/migrations/20261115_initial_schema.sql`, the system enforces a **strict owner authentication model**:
- The database is locked to your authorized owner email: `wa006514@gmail.com`.
- **Unauthorized Signup Prevention**: If any unauthorized visitor attempts to register an account, the PostgreSQL trigger immediately raises an exception and aborts the registration.
- **Single-Owner Lockout**: As soon as your owner account is registered, all further registrations on the instance are permanently locked.
- *Note:* If you wish to use a different email, simply modify the email in Section 2 of `supabase/migrations/20261115_initial_schema.sql` before running the query.

---

## 2. Step-by-Step Setup

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click **"New Project"**.
3. Choose a name (e.g. `waleed-document-hub`), set a secure database password, and select your closest region.
4. Wait for the database provisioning to complete.

### Step 2: Run the SQL Schema Migration
1. In your Supabase Dashboard, click on **"SQL Editor"** from the left navigation.
2. Click **"New query"**.
3. Open `supabase/migrations/20261115_initial_schema.sql` in this repository, copy its entire contents, and paste them into the SQL Editor.
4. Click **"Run"** (green button).
5. You should see a success message (`Success. No rows returned`).
   This automatically:
   - Configures the `vault_settings`, `user_profiles`, `categories`, and `documents` tables.
   - Sets up idempotent `DROP POLICY IF EXISTS` guards to prevent duplicate policy errors.
   - Configures strict **Row Level Security (RLS)** ensuring zero cross-user access.
   - Enforces the `WITH CHECK` clauses on `INSERT` and `UPDATE` operations.
   - Sets up the private `vault` Storage bucket with owner-only path isolation.
   - Installs the trigger that closes public signups and permits only the authorized owner.

### Step 3: Verify the Storage Bucket
1. In the Supabase dashboard, click on **"Storage"** in the left sidebar.
2. Verify that a bucket named **`vault`** exists and that the **"Public"** badge is **OFF** (Private).
3. If not created automatically, click **"New Bucket"**, name it `vault`, ensure **"Public bucket" is UNCHECKED**, and save.

### Step 4: Get Your API Keys
1. In the Supabase dashboard, navigate to **Project Settings** (gear icon) -> **API**.
2. Copy the **Project URL** (e.g., `https://xyzcompany.supabase.co`).
3. Under **Project API keys**, copy the **`anon` `public`** key.
   *(NEVER copy or expose the `service_role` key in frontend code or git!)*

### Step 5: Configure Your `.env` File
1. In your local project root (`d:\Personal Site`), create a `.env` file (or copy `.env.example` to `.env`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   VITE_INACTIVITY_TIMEOUT_MINUTES=15
   ```
2. Restart your development server (`npm run dev`).

### Step 6: First-Owner Setup
1. Open the website in your browser (`http://localhost:5173`).
2. Click **"First Visit? Setup Owner Account"** to create your master credentials using your authorized email (`wa006514@gmail.com`).
3. Once registered, log in to access your secure document vault!
