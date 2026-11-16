import React from 'react';
import { Download, ExternalLink, Mail, Phone, MapPin, Sparkles, Code2, Database } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/90 via-white to-blue-50/40 dark:from-navy-900 dark:via-navy-850 dark:to-navy-950 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm dark:shadow-2xl transition-colors duration-200">
      {/* Background glow effects */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-cyan-500/10 dark:bg-vault-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 relative z-10">
        {/* Profile Picture */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-3xl overflow-hidden border-2 border-blue-500/40 dark:border-vault-accent/50 shadow-xl shadow-blue-500/15 group">
            <img
              src="/assets/portfolio/waleed.png"
              alt="Waleed Ahmed Siddiqui"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=Waleed+Ahmed&background=2563eb&color=fff&size=256';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-blue-600 text-white text-[11px] font-bold rounded-xl shadow-lg border border-white/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Age 19</span>
          </div>
        </div>

        {/* Profile Information */}
        <div className="flex-1 text-center lg:text-left space-y-3 min-w-0">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-vault-accent text-xs font-semibold border border-blue-500/25 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> BS Data Science
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-500/25 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Front-End Developer
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1 border border-slate-200 dark:border-transparent">
              <MapPin className="w-3 h-3 text-blue-600 dark:text-vault-accent" /> Karachi, Pakistan
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Waleed Ahmed Siddiqui
          </h1>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            19-year-old Data Science undergraduate at <strong>FAST-NUCES</strong> and passionate Front-End Developer dedicated to creating responsive, high-performance, and visually engaging digital experiences.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
            <a
              href="/assets/portfolio/Waleed_Ahmed_Resume.pdf"
              download="Waleed_Ahmed_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-vault-blue hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CV / Resume</span>
            </a>

            <a
              href="https://waleedahmed-portfolio.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 transition flex items-center gap-2"
            >
              <span>Netlify Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://github.com/Waleed0334"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 transition flex items-center gap-2"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://www.linkedin.com/in/waleed-ahmed-7b63342a6/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 transition flex items-center gap-2"
            >
              <span>LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
