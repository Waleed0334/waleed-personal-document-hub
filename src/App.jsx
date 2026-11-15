import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DocumentProvider, useDocuments } from './context/DocumentContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './views/DashboardView';
import { DocumentsView } from './views/DocumentsView';
import { PortfolioView } from './views/PortfolioView';
import { SettingsView } from './views/SettingsView';
import { LoginModal } from './components/auth/LoginModal';
import { SetupOwnerModal } from './components/auth/SetupOwnerModal';
import { ResetPasswordModal } from './components/auth/ResetPasswordModal';
import { SetupGuideModal } from './components/auth/SetupGuideModal';
import { InactivityWarningModal } from './components/auth/InactivityWarningModal';
import { UploadModal } from './components/vault/UploadModal';
import { DocumentViewerModal } from './components/vault/DocumentViewerModal';
import { EditDocumentModal } from './components/vault/EditDocumentModal';
import { DeleteConfirmModal } from './components/vault/DeleteConfirmModal';
import { Shield } from 'lucide-react';

function VaultApp() {
  const { user, loading, isDemoMode } = useAuth();
  const { setSelectedCategory } = useDocuments();

  // Navigation state: { view: 'dashboard' | 'documents' | 'portfolio' | 'settings', id: string }
  const [currentView, setCurrentView] = useState({ view: 'dashboard', id: 'dashboard' });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadDefaultCategory, setUploadDefaultCategory] = useState(null);
  const [previewingDoc, setPreviewingDoc] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [deletingDoc, setDeletingDoc] = useState(null);

  // Auth modals state
  const [setupOwnerOpen, setSetupOwnerOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [setupGuideOpen, setSetupGuideOpen] = useState(false);

  // Clear any active document modal state on logout or unauthenticated state
  React.useEffect(() => {
    if (!user && !isDemoMode) {
      setPreviewingDoc(null);
      setEditingDoc(null);
      setDeletingDoc(null);
      setUploadModalOpen(false);
    }
  }, [user, isDemoMode]);

  const handleOpenUpload = (categoryId = null) => {
    setUploadDefaultCategory(categoryId);
    setUploadModalOpen(true);
  };

  const handleNavigateToCategory = (catId) => {
    setSelectedCategory(catId);
    setCurrentView({ view: 'documents', id: catId === 'all' ? 'all-docs' : catId });
  };

  const handleSidebarNavigate = (view, id) => {
    setCurrentView({ view, id });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-vault-accent flex items-center justify-center border border-blue-500/30 mb-4 animate-pulse">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">Waleed's Document Vault</h2>
        <p className="text-xs text-slate-400 mt-1">Initializing secure encrypted environment...</p>
      </div>
    );
  }

  // If user is not authenticated and not in demo mode -> Show Login Screen
  if (!user && !isDemoMode) {
    return (
      <>
        <LoginModal
          onOpenSetupOwner={() => setSetupOwnerOpen(true)}
          onOpenResetPassword={() => setResetPasswordOpen(true)}
          onOpenSetupGuide={() => setSetupGuideOpen(true)}
        />
        <SetupOwnerModal
          isOpen={setupOwnerOpen}
          onClose={() => setSetupOwnerOpen(false)}
        />
        <ResetPasswordModal
          isOpen={resetPasswordOpen}
          onClose={() => setResetPasswordOpen(false)}
        />
        <SetupGuideModal
          isOpen={setupGuideOpen}
          onClose={() => setSetupGuideOpen(false)}
        />
      </>
    );
  }

  // Determine current view title
  const getViewTitle = () => {
    switch (currentView.view) {
      case 'dashboard':
        return 'Vault Dashboard';
      case 'documents':
        return 'Document Explorer';
      case 'portfolio':
        return 'About Me & Portfolio';
      case 'settings':
        return 'Vault Settings & Security';
      default:
        return 'Document Hub';
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleSidebarNavigate}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isOpenMobile={isMobileSidebarOpen}
        setIsOpenMobile={setIsMobileSidebarOpen}
        onOpenSetupGuide={() => setSetupGuideOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenUpload={handleOpenUpload}
          onOpenSetupGuide={() => setSetupGuideOpen(true)}
          currentViewTitle={getViewTitle()}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView.view === 'dashboard' && (
            <DashboardView
              onOpenUpload={handleOpenUpload}
              onPreviewDoc={(doc) => setPreviewingDoc(doc)}
              onEditDoc={(doc) => setEditingDoc(doc)}
              onDeleteDoc={(doc) => setDeletingDoc(doc)}
              onNavigateToCategory={handleNavigateToCategory}
            />
          )}

          {currentView.view === 'documents' && (
            <DocumentsView
              onOpenUpload={handleOpenUpload}
              onPreviewDoc={(doc) => setPreviewingDoc(doc)}
              onEditDoc={(doc) => setEditingDoc(doc)}
              onDeleteDoc={(doc) => setDeletingDoc(doc)}
            />
          )}

          {currentView.view === 'portfolio' && <PortfolioView />}

          {currentView.view === 'settings' && (
            <SettingsView onOpenSetupGuide={() => setSetupGuideOpen(true)} />
          )}
        </main>
      </div>

      {/* Global Inactivity Warning Modal */}
      <InactivityWarningModal />

      {/* Vault Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        defaultCategoryId={uploadDefaultCategory}
      />

      <DocumentViewerModal
        isOpen={!!previewingDoc}
        document={previewingDoc}
        onClose={() => setPreviewingDoc(null)}
        onEdit={(doc) => setEditingDoc(doc)}
      />

      <EditDocumentModal
        isOpen={!!editingDoc}
        document={editingDoc}
        onClose={() => setEditingDoc(null)}
      />

      <DeleteConfirmModal
        isOpen={!!deletingDoc}
        document={deletingDoc}
        onClose={() => setDeletingDoc(null)}
      />

      <SetupGuideModal
        isOpen={setupGuideOpen}
        onClose={() => setSetupGuideOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <VaultApp />
      </DocumentProvider>
    </AuthProvider>
  );
}
