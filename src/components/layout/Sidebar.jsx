import React from 'react';
import {
  LayoutDashboard,
  Files,
  UserCheck,
  GraduationCap,
  School,
  Briefcase,
  Award,
  FileText,
  Star,
  Clock,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocuments } from '../../context/DocumentContext';

export function Sidebar({
  currentView,
  onNavigate,
  isCollapsed,
  setIsCollapsed,
  isOpenMobile,
  setIsOpenMobile,
  onOpenSetupGuide,
}) {
  const { user, logout, isDemoMode } = useAuth();
  const { setSelectedCategory, setOnlyFavorites, setSearchQuery } = useDocuments();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      view: 'dashboard',
    },
    {
      id: 'all-docs',
      label: 'All Documents',
      icon: Files,
      view: 'documents',
      category: 'all',
    },
    {
      id: 'personal',
      label: 'Personal Documents',
      icon: UserCheck,
      view: 'documents',
      category: '00000000-0000-0000-0000-000000000001',
    },
    {
      id: 'educational',
      label: 'Educational Documents',
      icon: GraduationCap,
      view: 'documents',
      category: '00000000-0000-0000-0000-000000000002',
    },
    {
      id: 'university',
      label: 'University Documents',
      icon: School,
      view: 'documents',
      category: '00000000-0000-0000-0000-000000000003',
    },
    {
      id: 'professional',
      label: 'Professional Documents',
      icon: Briefcase,
      view: 'documents',
      category: '00000000-0000-0000-0000-000000000004',
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: Award,
      view: 'documents',
      category: '00000000-0000-0000-0000-000000000004',
      keyword: 'Certificate',
    },
    {
      id: 'my-cv',
      label: 'My CV / Resume',
      icon: FileText,
      view: 'documents',
      category: '00000000-0000-0000-0000-000000000004',
      keyword: 'CV',
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Star,
      view: 'documents',
      favoritesOnly: true,
    },
    {
      id: 'portfolio',
      label: 'About Me (Portfolio)',
      icon: User,
      view: 'portfolio',
    },
    {
      id: 'settings',
      label: 'Vault Settings',
      icon: Settings,
      view: 'settings',
    },
  ];

  const handleItemClick = (item) => {
    if (item.category) {
      setSelectedCategory(item.category);
    }
    if (item.favoritesOnly) {
      setOnlyFavorites(true);
    } else {
      setOnlyFavorites(false);
    }
    if (item.keyword) {
      setSearchQuery(item.keyword);
    }

    onNavigate(item.view, item.id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 dark:bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-navy-950 border-r border-slate-200 dark:border-slate-800/90 flex flex-col transition-all duration-300 shadow-xl lg:shadow-none ${
          isCollapsed ? 'w-20' : 'w-64 max-w-[85vw]'
        } ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand / Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-vault-accent flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  Waleed's Vault
                </h1>
                <span className="text-[10px] text-blue-600 dark:text-vault-accent font-medium block">
                  Document Hub
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Toggle */}
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsOpenMobile(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer group min-h-[42px] ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-900'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-vault-accent'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer: User profile & Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-3 p-2 bg-slate-100 dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <img
                src="/assets/portfolio/waleed.png"
                alt="Waleed"
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=Waleed+Ahmed&background=2563eb&color=fff';
                }}
                className="w-8 h-8 rounded-lg object-cover border border-blue-400/40 shrink-0"
              />
              <div className="truncate flex-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                  Waleed Ahmed
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                  {isDemoMode ? 'Synthetic Demo' : user?.email || 'Vault Owner'}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenSetupGuide}
              className={`p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-900 text-xs flex items-center gap-2 transition ${
                isCollapsed ? 'w-full justify-center' : 'flex-1'
              }`}
              title="Setup Guide"
            >
              <HelpCircle className="w-4 h-4 text-blue-600 dark:text-vault-accent" />
              {!isCollapsed && <span>Setup Guide</span>}
            </button>

            <button
              type="button"
              onClick={logout}
              className={`p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs flex items-center gap-2 transition ${
                isCollapsed ? 'w-full justify-center' : 'shrink-0'
              }`}
              title="Lock Vault & Sign Out"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Lock</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
