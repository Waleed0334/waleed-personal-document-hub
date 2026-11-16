import React from 'react';
import { Phone, MessageSquare, Mail, Globe, MapPin } from 'lucide-react';

function LinkedinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.88c-.96 0-1.74.78-1.74 1.74s.78 1.74 1.74 1.74 1.74-.78 1.74-1.74-.78-1.74-1.74-1.74Z" />
    </svg>
  );
}

export function ContactSection() {
  const contactMethods = [
    {
      title: 'WhatsApp',
      value: '+92 325 2774492',
      href: 'https://wa.me/923252774492',
      icon: MessageSquare,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      action: 'Send Message',
    },
    {
      title: 'Direct Phone',
      value: '0325 2774492',
      href: 'tel:+923252774492',
      icon: Phone,
      color: 'bg-blue-500/10 text-blue-600 dark:text-vault-accent border-blue-500/20',
      action: 'Call Now',
    },
    {
      title: 'Email Address',
      value: 'wa006514@gmail.com',
      href: 'mailto:wa006514@gmail.com',
      icon: Mail,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      action: 'Send Email',
    },
    {
      title: 'LinkedIn',
      value: 'linkedin.com/in/waleed-ahmed-7b63342a6/',
      href: 'https://www.linkedin.com/in/waleed-ahmed-7b63342a6/',
      icon: LinkedinIcon,
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      action: 'Connect',
    },
  ];

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 space-y-6 shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Get in Touch</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Feel free to reach out for Data Science collaboration, software development, or inquiries.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-vault-accent" />
          <span>Karachi, Pakistan</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {contactMethods.map((method, idx) => {
          const Icon = method.icon;
          return (
            <a
              key={idx}
              href={method.href}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between group cursor-pointer shadow-sm"
            >
              <div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${method.color} mb-3`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">{method.title}</h4>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-vault-accent transition truncate">
                  {method.value}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-900 flex items-center justify-between text-xs text-blue-600 dark:text-vault-accent font-medium">
                <span>{method.action}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
