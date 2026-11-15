import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, ShieldCheck, X, FileCode, AlertTriangle } from 'lucide-react';

export function SetupGuideModal({ isOpen, onClose }) {
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const envTemplate = `# Waleed's Document Vault Environment Variables
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
VITE_INACTIVITY_TIMEOUT_MINUTES=15`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const copySqlNotice = () => {
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-navy-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-vault-accent flex items-center justify-center border border-blue-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Supabase Setup &amp; Security Guide</h2>
            <p className="text-xs text-slate-400">Configure your private cloud storage and database in 4 steps</p>
          </div>
        </div>

        {/* Security Alert Note */}
        <div className="p-3.5 mb-5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-vault-accent mt-0.5" />
          <div>
            <span className="font-semibold block text-white">Private Zero-Trust Document Architecture</span>
            Documents are stored in a private Supabase bucket (`vault`) with strict Row Level Security. Even if someone knows an internal object path, direct unauthorized access is rejected with HTTP 403 Forbidden. Files are securely accessed only via short-lived signed URLs.
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-navy-800/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-vault-accent text-xs flex items-center justify-center font-bold">1</span>
                Create Free Supabase Project
              </span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-vault-accent hover:underline flex items-center gap-1 font-medium"
              >
                Open Supabase <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-slate-400">
              Sign in to Supabase, click "New Project", specify your database password, and choose your preferred region.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-navy-800/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-vault-accent text-xs flex items-center justify-center font-bold">2</span>
                Run SQL Schema &amp; Storage Policies
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <FileCode className="w-3 h-3 text-vault-accent" />
                supabase/migrations/20261115_initial_schema.sql
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              In your Supabase Dashboard, open <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, paste the migration SQL file located in <code>supabase/migrations/20261115_initial_schema.sql</code>, and click <strong>Run</strong>.
            </p>
            <div className="bg-navy-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>File path: supabase/migrations/20261115_initial_schema.sql</span>
              <button
                type="button"
                onClick={copySqlNotice}
                className="px-2 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs flex items-center gap-1"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSql ? 'Ready' : 'File Saved'}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-navy-800/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-vault-accent text-xs flex items-center justify-center font-bold">3</span>
                Add Credentials to <code>.env</code>
              </span>
              <button
                type="button"
                onClick={copyEnv}
                className="px-2 py-1 rounded bg-blue-600/30 text-vault-accent hover:bg-blue-600/50 text-xs flex items-center gap-1 font-medium transition cursor-pointer"
              >
                {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedEnv ? 'Copied Template!' : 'Copy .env Template'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              From Supabase <strong>Project Settings &gt; API</strong>, copy the <strong>Project URL</strong> and <strong>Anon Public Key</strong> into a local <code>.env</code> file in your project root.
            </p>
            <pre className="bg-navy-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto">
              {envTemplate}
            </pre>
          </div>

          {/* Step 4: GitHub Security */}
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>
              <span className="font-semibold block text-rose-200">GitHub Security Warning</span>
              The <code>.env</code> file and your sensitive personal documents are excluded via <code>.gitignore</code>. Never commit service-role keys or actual private documents to any git repository!
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
