import React from 'react';
import { Code, Terminal, Cpu, Database, Sigma, Award } from 'lucide-react';

export function SkillsSection() {
  const skillCategories = [
    {
      name: 'Front-End Development',
      icon: Code,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Responsive Web Design', 'Tailwind CSS', 'React.js'],
    },
    {
      name: 'Programming Languages',
      icon: Terminal,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      skills: ['C Programming', 'C++ (OOP & Data Structures)', 'Python'],
    },
    {
      name: 'Mathematics & Data Science',
      icon: Database,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      skills: ['Data Science', 'Computational Mathematics', 'Statistics', 'Algorithm Design'],
    },
    {
      name: 'Interests & Activities',
      icon: Cpu,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      skills: ['Competitive Programming', 'VibeCoding & AI Workflows', 'Cricket', 'Gaming'],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-vault-accent" />
          <h3 className="text-lg font-bold text-white">Technical Skills &amp; Stack</h3>
        </div>
        <span className="text-xs text-slate-500">Core Proficiencies</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={idx}
              className="bg-navy-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className={`p-2 rounded-xl border ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">{cat.name}</h4>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
