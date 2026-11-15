import React from 'react';
import { CreditCard, GraduationCap, School, FileText, Award, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export function QuickAccessShortcuts({ onOpenCategory, onSearchKey }) {
  const { allDocuments } = useDocuments();

  const shortcuts = [
    {
      title: 'National CNIC',
      subtitle: 'Front & Back Specimen',
      icon: CreditCard,
      color: 'from-emerald-600 to-teal-500',
      searchTerm: 'CNIC',
      categoryId: '00000000-0000-0000-0000-000000000001',
    },
    {
      title: 'FAST Student Card',
      subtitle: 'University ID Card',
      icon: School,
      color: 'from-blue-600 to-indigo-600',
      searchTerm: 'FAST',
      categoryId: '00000000-0000-0000-0000-000000000003',
    },
    {
      title: 'Updated CV / Resume',
      subtitle: 'Data Science & Front-End',
      icon: FileText,
      color: 'from-sky-600 to-blue-500',
      searchTerm: 'CV',
      categoryId: '00000000-0000-0000-0000-000000000004',
    },
    {
      title: 'Matric Marksheet',
      subtitle: 'The Educators (86.45%)',
      icon: GraduationCap,
      color: 'from-purple-600 to-indigo-500',
      searchTerm: 'Matric',
      categoryId: '00000000-0000-0000-0000-000000000002',
    },
    {
      title: 'Semester Transcripts',
      subtitle: 'FAST-NUCES Transcripts',
      icon: FileSpreadsheet,
      color: 'from-cyan-600 to-blue-600',
      searchTerm: 'Transcript',
      categoryId: '00000000-0000-0000-0000-000000000002',
    },
    {
      title: 'Coder\'s Cup Award',
      subtitle: 'ACM Competitive Prog',
      icon: Award,
      color: 'from-amber-600 to-orange-500',
      searchTerm: 'ACM',
      categoryId: '00000000-0000-0000-0000-000000000004',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Quick Access Documents
        </h3>
        <span className="text-[11px] text-slate-500">1-click direct retrieval</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {shortcuts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSearchKey(item.searchTerm)}
              className="p-3 bg-navy-900 hover:bg-navy-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition group cursor-pointer flex flex-col justify-between"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.color} text-white flex items-center justify-center mb-2 shadow-sm`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-white group-hover:text-vault-accent transition truncate">
                  {item.title}
                </h5>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
