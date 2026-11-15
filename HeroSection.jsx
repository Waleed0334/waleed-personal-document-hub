import React from 'react';
import { Download, ExternalLink, Mail, Phone, MapPin, Sparkles, Code2, Database } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-vault-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
        {/* Profile Picture */}
        <div className="relative shrink-0">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-vault-accent/50 shadow-2xl shadow-blue-500/20 group">
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
        <div className="flex-1 text-center lg:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-vault-accent text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> BS Data Science
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Front-End Developer
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3 text-vault-accent" /> Karachi, Pakistan
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Waleed Ahmed Siddiqui
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            19-year-old Data Science undergraduate at <strong>FAST-NUCES</strong> and passionate Front-End Developer dedicated to creating responsive, high-performance, and visually engaging digital experiences.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a
              href="/assets/portfolio/Waleed_Ahmed_Resume.pdf"
              download="Waleed_Ahmed_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-vault-blue hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CV / Resume</span>
            </a>

            <a
              href="https://waleedahmed-portfolio.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-navy-800 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-medium border border-slate-700 transition flex items-center gap-2"
            >
              <span>Netlify Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://github.com/Waleed0334"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-navy-800 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-medium border border-slate-700 transition flex items-center gap-2"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="https://www.linkedin.com/in/waleed-ahmed-7b63342a6/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-navy-800 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-medium border border-slate-700 transition flex items-center gap-2"
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
