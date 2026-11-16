import React from 'react';
import { Award, Download, ExternalLink, ShieldCheck } from 'lucide-react';

export function CertificatesSection() {
  const certificates = [
    {
      title: 'Competitive Programming',
      organization: 'ACM Coder\'s Cup',
      image: '/assets/portfolio/codercup.jpeg',
      pdf: '/assets/portfolio/waleed_coderscup.pdf',
      description: 'Awarded for advanced algorithmic problem-solving and rapid competitive coding proficiency.',
    },
    {
      title: 'Axtera Agent X',
      organization: 'PROCOM 26',
      image: '/assets/portfolio/procom.jpeg',
      pdf: '/assets/portfolio/waleed_procom26.pdf',
      description: 'Official credential earned during PROCOM 26 competition for autonomous agent engineering.',
    },
    {
      title: 'Today We Are VibeCoding',
      organization: 'Developer\'s Day',
      image: '/assets/portfolio/developerday.jpeg',
      pdf: '/assets/portfolio/waleed_developersday.pdf',
      description: 'Recognition in modern AI-assisted engineering, pair-programming, and rapid software delivery.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600 dark:text-vault-accent" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Honors &amp; Certificates</h3>
        </div>
        <span className="text-xs text-slate-500">Genuine Credentials from Portfolio</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {certificates.map((cert, idx) => (
          <div
            key={idx}
            className="group bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="h-44 bg-slate-100 dark:bg-navy-950 overflow-hidden relative">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 dark:bg-navy-900/90 text-blue-700 dark:text-vault-accent text-[10px] font-semibold border border-slate-200 dark:border-slate-700 backdrop-blur-sm flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Verified Asset</span>
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <span className="text-[11px] font-bold text-blue-600 dark:text-vault-accent uppercase tracking-wider block">
                  {cert.organization}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cert.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{cert.description}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-3">
              <a
                href={cert.pdf}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-medium border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <span>View PDF</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href={cert.pdf}
                download
                className="py-2 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-700 dark:text-sky-200 hover:text-white dark:bg-blue-600/30 text-xs font-medium border border-blue-500/25 dark:border-blue-500/30 transition flex items-center justify-center gap-1"
                title="Download PDF"
                aria-label="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
