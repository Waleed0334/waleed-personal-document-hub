import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import {
  validateFile,
  uploadDocumentToSupabase,
  getDocumentSignedUrl,
  fetchUserDocuments,
  fetchCategories,
  createCategory,
  updateDocument as apiUpdateDocument,
  deleteDocument as apiDeleteDocument,
  recordAccess as apiRecordAccess,
} from '../services/documentService';

const DocumentContext = createContext(null);

// Synthetic sample documents strictly for Demo Mode
const SYNTHETIC_DEMO_DOCUMENTS = [
  {
    id: 'demo-doc-1',
    user_id: 'demo-user-id',
    title: 'FAST University Student Card (Synthetic Sample)',
    original_filename: 'FAST_Student_Card_Sample.pdf',
    file_path: 'demo/fast_card.pdf',
    file_size: 1420000,
    file_type: 'application/pdf',
    category_id: '00000000-0000-0000-0000-000000000003',
    category_name: 'University Documents',
    subcategory: 'FAST University Student Card',
    tags: ['FAST', 'Student Card', 'University', 'ID'],
    description: 'Synthetic mockup of university identity card for demonstration.',
    is_favorite: true,
    view_count: 14,
    last_accessed_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    preview_url: '/assets/portfolio/Waleed_Ahmed_Resume.pdf',
    is_synthetic: true,
  },
  {
    id: 'demo-doc-2',
    user_id: 'demo-user-id',
    title: 'Matriculation Board Marksheet (Synthetic Sample)',
    original_filename: 'Matric_Marksheet_Dummy.pdf',
    file_path: 'demo/matric.pdf',
    file_size: 2150000,
    file_type: 'application/pdf',
    category_id: '00000000-0000-0000-0000-000000000002',
    category_name: 'Educational Documents',
    subcategory: 'Matric Marksheet',
    tags: ['Matric', 'The Educators', 'Marksheet', 'Education'],
    description: 'Synthetic sample marksheet placeholder.',
    is_favorite: true,
    view_count: 9,
    last_accessed_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    preview_url: '/assets/portfolio/Waleed_Ahmed_Resume.pdf',
    is_synthetic: true,
  },
  {
    id: 'demo-doc-3',
    user_id: 'demo-user-id',
    title: 'National Identity Card (Synthetic Specimen)',
    original_filename: 'CNIC_Specimen_Front.png',
    file_path: 'demo/cnic.png',
    file_size: 890000,
    file_type: 'image/png',
    category_id: '00000000-0000-0000-0000-000000000001',
    category_name: 'Personal Documents',
    subcategory: 'CNIC (Front)',
    tags: ['CNIC', 'National ID', 'Personal', 'Identity'],
    description: 'Non-real sample identity graphic for testing image previewer.',
    is_favorite: false,
    view_count: 5,
    last_accessed_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    preview_url: '/assets/portfolio/waleed.png',
    is_synthetic: true,
  },
  {
    id: 'demo-doc-4',
    user_id: 'demo-user-id',
    title: 'Updated CV & Resume (Sample)',
    original_filename: 'Waleed_Ahmed_Resume.pdf',
    file_path: 'demo/cv.pdf',
    file_size: 29192,
    file_type: 'application/pdf',
    category_id: '00000000-0000-0000-0000-000000000004',
    category_name: 'Professional Documents',
    subcategory: 'Updated CV / Resume',
    tags: ['CV', 'Resume', 'Data Science', 'Portfolio'],
    description: 'Professional resume file available for verification.',
    is_favorite: true,
    view_count: 22,
    last_accessed_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    preview_url: '/assets/portfolio/Waleed_Ahmed_Resume.pdf',
    is_synthetic: true,
  },
  {
    id: 'demo-doc-5',
    user_id: 'demo-user-id',
    title: 'ACM Coder’s Cup Certificate',
    original_filename: 'waleed_coderscup.pdf',
    file_path: 'demo/coderscup.pdf',
    file_size: 2241899,
    file_type: 'application/pdf',
    category_id: '00000000-0000-0000-0000-000000000004',
    category_name: 'Professional Documents',
    subcategory: 'Competition Certificates',
    tags: ['ACM', 'Competitive Programming', 'Certificate', 'CoderCup'],
    description: 'Certificate for competitive programming contest.',
    is_favorite: false,
    view_count: 7,
    last_accessed_at: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    preview_url: '/assets/portfolio/waleed_coderscup.pdf',
    is_synthetic: true,
  },
];

export function DocumentProvider({ children }) {
  const { user, isDemoMode, isConfigured } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('date-desc');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vault_recent_searches');
      return saved ? JSON.parse(saved) : ['Matric', 'CNIC', 'FAST', 'CV'];
    } catch {
      return ['Matric', 'CNIC', 'FAST', 'CV'];
    }
  });

  // Track temporary in-memory Blob URLs for revocation on logout / expiry
  const blobUrlsRef = useRef([]);

  // Comprehensive state clearance on logout or inactivity lock
  const clearDocumentState = useCallback(() => {
    // 1. Revoke all temporary object URLs to prevent memory and data leakage
    blobUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn('Error revoking blob URL:', e);
      }
    });
    blobUrlsRef.current = [];

    // 2. Clear document lists and active filters
    setDocuments([]);
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedSort('date-desc');
    setOnlyFavorites(false);

    // 3. Clear sensitive search caches from browser session
    try {
      sessionStorage.removeItem('vault_recent_searches');
    } catch {}
  }, []);

  // Fetch categories from public.categories or fallback to default
  const loadCategories = useCallback(async () => {
    if (isDemoMode || !isConfigured || !user) {
      setCategories(DEFAULT_CATEGORIES);
      return;
    }
    try {
      const dbCategories = await fetchCategories();
      if (dbCategories && dbCategories.length > 0) {
        setCategories(dbCategories);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (err) {
      console.warn('Failed to load categories from database, using defaults:', err);
      setCategories(DEFAULT_CATEGORIES);
    }
  }, [user, isDemoMode, isConfigured]);

  // Load documents
  const loadDocuments = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        setDocuments(SYNTHETIC_DEMO_DOCUMENTS);
      } else if (!isConfigured || !user) {
        setDocuments([]);
      } else {
        const docs = await fetchUserDocuments(user.id);
        setDocuments(docs);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isDemoMode, isConfigured]);

  useEffect(() => {
    if (!user && !isDemoMode) {
      clearDocumentState();
      setLoading(false);
    } else {
      loadDocuments();
      loadCategories();
    }
  }, [user, isDemoMode, loadDocuments, loadCategories, clearDocumentState]);

  // Upload single or multiple files
  const uploadFiles = async (fileList, metadataList) => {
    if (!fileList || fileList.length === 0) return [];

    const uploaded = [];
    const errors = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const meta = metadataList[i] || metadataList[0] || {};

      // Validate
      const validation = validateFile(file);
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`);
        continue;
      }

      if (isDemoMode || !isConfigured) {
        // In synthetic demo mode: create an ephemeral local object
        const blobUrl = URL.createObjectURL(file);
        blobUrlsRef.current.push(blobUrl);

        const newDemoDoc = {
          id: `demo-${Date.now()}-${i}`,
          user_id: user?.id || 'demo-user-id',
          title: meta.title || file.name.replace(/\.[^/.]+$/, ''),
          original_filename: file.name,
          file_path: `demo/${file.name}`,
          file_size: file.size,
          file_type: file.type || 'application/octet-stream',
          category_id: meta.category?.id || '00000000-0000-0000-0000-000000000005',
          category_name: meta.category?.name || 'Other Documents',
          subcategory: meta.subcategory || null,
          tags: meta.tags || [],
          description: meta.description || '',
          is_favorite: false,
          view_count: 0,
          last_accessed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          preview_url: blobUrl,
          is_synthetic: true,
        };
        uploaded.push(newDemoDoc);
      } else {
        try {
          const doc = await uploadDocumentToSupabase({
            file,
            title: meta.title,
            category: meta.category,
            subcategory: meta.subcategory,
            tags: meta.tags,
            description: meta.description,
            userId: user.id,
          });
          uploaded.push(doc);
        } catch (err) {
          errors.push(`${file.name}: ${err.message}`);
        }
      }
    }

    if (uploaded.length > 0) {
      setDocuments((prev) => [...uploaded, ...prev]);
    }

    return { uploaded, errors };
  };

  // Update document metadata
  const updateDoc = async (id, updates) => {
    if (isDemoMode || !isConfigured) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, ...updates, updated_at: new Date().toISOString() } : doc
        )
      );
      return;
    }

    const updated = await apiUpdateDocument(id, updates);
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? updated : doc)));
    return updated;
  };

  // Toggle favorite
  const toggleFavorite = async (id) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;
    const newFavorite = !doc.is_favorite;

    await updateDoc(id, { is_favorite: newFavorite });
  };

  // Delete document
  const deleteDoc = async (id) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    if (!isDemoMode && isConfigured) {
      await apiDeleteDocument(id, doc.file_path);
    }

    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Record document access / view
  const recordAccess = async (id) => {
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    if (!isDemoMode && isConfigured) {
      apiRecordAccess(id);
    }

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              view_count: (d.view_count || 0) + 1,
              last_accessed_at: new Date().toISOString(),
            }
          : d
      )
    );
  };

  // Obtain temporary signed preview/download URL
  // Exactly 60 seconds default expiration enforced
  const getDocumentUrl = async (doc) => {
    if (doc.preview_url) {
      return doc.preview_url;
    }

    if (!isConfigured || isDemoMode) {
      return '/assets/portfolio/Waleed_Ahmed_Resume.pdf';
    }

    // Call Supabase private signed URL with exact 60s expiration
    return await getDocumentSignedUrl(doc.file_path, 60);
  };

  // Add category: persists to public.categories in Supabase mode or in-memory in Demo mode
  const addCategory = async (name, icon = 'Folder', subcategories = []) => {
    if (!isDemoMode && isConfigured && user) {
      const created = await createCategory({
        name,
        icon,
        color: 'vault-accent',
        subcategories,
        userId: user.id,
      });
      setCategories((prev) => [...prev, created]);
      return created;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat = {
      id: `00000000-0000-0000-0000-${Date.now().toString().slice(-12).padStart(12, '0')}`,
      name,
      slug,
      icon,
      color: 'vault-accent',
      description: 'Custom category',
      subcategories,
      is_system: false,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  // Track search query with history
  const handleSetSearchQuery = (query) => {
    setSearchQuery(query);
    if (query && query.trim().length > 1) {
      setRecentSearches((prev) => {
        const trimmed = query.trim();
        const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
        const updated = [trimmed, ...filtered].slice(0, 8);
        try {
          sessionStorage.setItem('vault_recent_searches', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  // Filtered & sorted documents
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        // 1. Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = doc.title?.toLowerCase().includes(q);
          const matchesCategory = doc.category_name?.toLowerCase().includes(q);
          const matchesSubcat = doc.subcategory?.toLowerCase().includes(q);
          const matchesDesc = doc.description?.toLowerCase().includes(q);
          const matchesTags = doc.tags?.some((t) => t.toLowerCase().includes(q));

          if (!matchesTitle && !matchesCategory && !matchesSubcat && !matchesDesc && !matchesTags) {
            return false;
          }
        }

        // 2. Category Filter
        if (selectedCategory !== 'all') {
          if (doc.category_id !== selectedCategory && doc.category_name !== selectedCategory) {
            return false;
          }
        }

        // 3. Type Filter
        if (selectedType !== 'all') {
          if (selectedType === 'pdf' && !doc.file_type?.includes('pdf')) return false;
          if (selectedType === 'image' && !doc.file_type?.includes('image')) return false;
          if (
            selectedType === 'other' &&
            (doc.file_type?.includes('pdf') || doc.file_type?.includes('image'))
          ) {
            return false;
          }
        }

        // 4. Favorites Only
        if (onlyFavorites && !doc.is_favorite) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'date-desc') {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        if (selectedSort === 'date-asc') {
          return new Date(a.created_at) - new Date(b.created_at);
        }
        if (selectedSort === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (selectedSort === 'title-desc') {
          return b.title.localeCompare(a.title);
        }
        if (selectedSort === 'size-desc') {
          return (b.file_size || 0) - (a.file_size || 0);
        }
        if (selectedSort === 'views-desc') {
          return (b.view_count || 0) - (a.view_count || 0);
        }
        return 0;
      });
  }, [documents, searchQuery, selectedCategory, selectedType, selectedSort, onlyFavorites]);

  // Statistics
  const stats = useMemo(() => {
    const totalDocs = documents.length;
    const totalBytes = documents.reduce((sum, d) => sum + (d.file_size || 0), 0);
    const totalCategoriesCount = categories.length;

    const recentUploads = [...documents]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    const frequentDocs = [...documents]
      .filter((d) => (d.view_count || 0) > 0)
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 5);

    const recentlyViewed = [...documents]
      .filter((d) => d.last_accessed_at)
      .sort((a, b) => new Date(b.last_accessed_at) - new Date(a.last_accessed_at))
      .slice(0, 5);

    const favoriteDocs = documents.filter((d) => d.is_favorite);

    return {
      totalDocs,
      totalBytes,
      storageMB: (totalBytes / (1024 * 1024)).toFixed(2),
      totalCategoriesCount,
      recentUploads,
      frequentDocs,
      recentlyViewed,
      favoriteDocs,
    };
  }, [documents, categories]);

  const value = {
    documents: filteredDocuments,
    allDocuments: documents,
    categories,
    loading,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedSort,
    setSelectedSort,
    onlyFavorites,
    setOnlyFavorites,
    recentSearches,
    stats,
    uploadFiles,
    updateDoc,
    toggleFavorite,
    deleteDoc,
    recordAccess,
    getDocumentUrl,
    addCategory,
    refreshDocuments: loadDocuments,
    clearDocumentState,
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
