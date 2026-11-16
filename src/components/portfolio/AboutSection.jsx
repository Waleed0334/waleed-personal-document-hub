import React from 'react';
import { User, GraduationCap, Award, BookOpen } from 'lucide-react';

export function AboutSection() {
  const education = [
    {
      period: '2025 – 2029',
      title: 'Undergraduate (BS Data Science)',
      institution: 'FAST National University of Computer and Emerging Sciences',
      location: 'Karachi, Pakistan',
      score: 'CGPA: 3.12',
      badge: 'Current Degree',
      badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-vault-accent border-blue-500/30',
      description: 'Specializing in machine learning, data engineering, algorithms, and computational mathematics.',
    },
    {
      period: '2023 – 2025',
      title: 'Intermediate (Pre-Engineering)',
      institution: 'Govt. Dehli College',
      location: 'Karachi, Pakistan',
      score: 'Grade A (78.81%)',
      badge: 'Completed',
      badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      description: 'Focused on higher secondary physics, chemistry, and advanced mathematics.',
    },
    {
      period: '2021 – 2023',
      title: 'Matriculation (Science)',
      institution: 'The Educators School',
      location: 'Karachi, Pakistan',
      score: 'Grade A+ (86.45%)',
      badge: 'Distinction',
      badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
      description: 'Graduated with academic distinction and high aptitude in mathematics and computer sciences.',
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* About Biography */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-blue-600 dark:text-vault-accent uppercase tracking-wider mb-3">
          <User className="w-4 h-4" />
          <span>Professional Background</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3">About Me</h2>
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 max-w-4xl">
          <p>
            I am <strong>Waleed Ahmed Siddiqui</strong>, a 19-year-old Data Science undergraduate at <strong>FAST (NUCES)</strong> with a strong passion for front-end engineering, systems programming, and applied data science.
          </p>
          <p>
            I specialize in engineering modern, responsive, and visually engaging web interfaces using HTML, CSS, JavaScript, and React, coupled with algorithmic problem-solving in C, C++, and Python. My goal is to synthesize human-centered design with rigorous data analysis and secure architecture.
          </p>
        </div>
      </div>

      {/* Education Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-vault-accent" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Education History</h3>
          </div>
          <span className="text-xs text-slate-500">Verified Academic Credentials</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {education.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                    {item.period}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                <p className="text-xs font-semibold text-blue-600 dark:text-vault-accent mb-0.5">
                  {item.institution}
                </p>
                <p className="text-[11px] text-slate-500 mb-2">{item.location}</p>
                <div className="inline-block px-2.5 py-1 bg-slate-100 dark:bg-navy-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                  {item.score}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
