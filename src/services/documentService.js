import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../constants/categories.js';

/**
 * Explicit allowlist of fields permitted for client-side metadata updates
 */
export const ALLOWED_DOCUMENT_UPDATE_FIELDS = [
  'title',
  'category_id',
  'category_name',
  'subcategory',
  'tags',
  'description',
  'is_favorite',
];

/**
 * Cryptographically secure RFC4122 v4 UUID generator.
 * Exclusively uses Web Crypto / Node CSPRNG (crypto.randomUUID or crypto.getRandomValues).
 * Never uses Math.random.
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    if (typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      // RFC4122 v4 version and variant bits
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
    }
  }
  throw new Error('Cryptographically secure random number generator (CSPRNG) is unavailable.');
}

/**
 * Validate a file before uploading
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 50 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
    };
  }

  const isTypeAllowed =
    ALLOWED_MIME_TYPES.includes(file.type) ||
    file.name.endsWith('.pdf') ||
    file.name.endsWith('.jpg') ||
    file.name.endsWith('.jpeg') ||
    file.name.endsWith('.png') ||
    file.name.endsWith('.docx') ||
    file.name.endsWith('.doc');

  if (!isTypeAllowed) {
    return {
      valid: false,
      error: `File type "${file.type || 'unknown'}" is not supported. Please upload PDF, JPG, PNG, or DOC documents.`,
    };
  }

  return { valid: true };
}

/**
 * Fetch categories from Supabase public.categories
 */
export async function fetchCategories() {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }

  return data;
}

/**
 * Persist a custom category to Supabase public.categories
 */
export async function createCategory({
  name,
  icon = 'Folder',
  color = 'vault-accent',
  subcategories = [],
  userId,
}) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const record = {
    user_id: userId,
    name,
    slug,
    icon,
    color,
    subcategories: Array.isArray(subcategories) ? subcategories : [],
    is_system: false,
  };

  const { data, error } = await supabase
    .from('categories')
    .insert([record])
    .select()
    .single();

  if (error) {
    console.error('Failed to persist custom category:', error);
    throw error;
  }

  return data;
}

/**
 * Uploads a document to private Supabase Storage and records metadata in database.
 * Enforces:
 *   1. Verification of supabase.auth.getUser() matching userId
 *   2. Strict upload ordering: generateUUID -> storage upload -> metadata insert
 *   3. Storage cleanup on metadata insert failure with comprehensive reporting
 */
export async function uploadDocumentToSupabase({
  file,
  title,
  category,
  subcategory,
  tags = [],
  description = '',
  userId,
}) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase client is not configured.');
  }

  // 1. Verify authenticated session matches supplied userId
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    throw new Error('Authentication required: No active authenticated session found.');
  }
  if (authData.user.id !== userId) {
    throw new Error('Security Violation: Supplied userId does not match active authenticated session.');
  }

  // 2. Generate UUID first and construct strict storage path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileExt = sanitizedName.split('.').pop() || 'bin';
  const uniqueDocId = generateUUID();
  const filePath = `${userId}/${uniqueDocId}/${sanitizedName}`;

  // 3. Upload file to private 'vault' bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('vault')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Storage upload failed:', uploadError);
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // 4. Insert record into 'documents' table
  const documentRecord = {
    id: uniqueDocId,
    user_id: userId,
    title: title || file.name.replace(/\.[^/.]+$/, ''),
    original_filename: file.name,
    file_path: filePath,
    file_size: file.size,
    file_type: file.type || `application/${fileExt}`,
    category_id: category.id,
    category_name: category.name,
    subcategory: subcategory || null,
    tags: Array.isArray(tags) ? tags : [],
    description: description || '',
    is_favorite: false,
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: dbData, error: dbError } = await supabase
    .from('documents')
    .insert([documentRecord])
    .select()
    .single();

  if (dbError) {
    console.error('Database insert failed, attempting Storage rollback:', dbError);
    let cleanupReport = '';
    try {
      const { error: cleanupError } = await supabase.storage.from('vault').remove([filePath]);
      if (cleanupError) {
        cleanupReport = ` WARNING: Storage rollback cleanup failed: ${cleanupError.message}. Orphaned path: ${filePath}`;
        console.error('Storage cleanup failed:', cleanupError);
      } else {
        cleanupReport = ' Storage rollback cleanup succeeded.';
      }
    } catch (cleanupEx) {
      cleanupReport = ` WARNING: Storage rollback cleanup exception: ${cleanupEx.message}. Orphaned path: ${filePath}`;
      console.error('Storage cleanup exception:', cleanupEx);
    }
    throw new Error(`Failed to save document metadata: ${dbError.message}.${cleanupReport}`);
  }

  return dbData;
}

/**
 * Generate a short-lived signed URL for a private document.
 * Default expiration is exactly 60 seconds.
 */
export async function getDocumentSignedUrl(filePath, expiresInSeconds = 60) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.storage
    .from('vault')
    .createSignedUrl(filePath, expiresInSeconds);

  if (error) {
    console.error('Signed URL generation failed:', error);
    throw new Error(`Failed to generate signed access URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Fetch all documents for the authenticated user
 */
export async function fetchUserDocuments(userId) {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch documents error:', error);
    throw error;
  }

  return data || [];
}

/**
 * Update document metadata with strict allowlist enforcement
 */
export async function updateDocument(docId, updates) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  // Enforce explicit field allowlist
  const sanitizedUpdates = {};
  for (const field of ALLOWED_DOCUMENT_UPDATE_FIELDS) {
    if (field in updates) {
      sanitizedUpdates[field] = updates[field];
    }
  }

  if (Object.keys(sanitizedUpdates).length === 0) {
    throw new Error('No valid updatable fields provided in update payload.');
  }

  const { data, error } = await supabase
    .from('documents')
    .update({
      ...sanitizedUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', docId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Increment document view count and set last accessed time atomically via PostgreSQL RPC.
 * Falls back to direct update if RPC is not yet applied in database.
 */
export async function recordAccess(docId) {
  if (!isSupabaseConfigured() || !supabase) return;

  try {
    const { data, error } = await supabase.rpc('record_document_access', {
      p_document_id: docId,
    });

    if (error) {
      // Fallback if the RPC migration is not yet executed in the database
      console.warn('RPC record_document_access unavailable, using fallback update:', error.message);
      const { data: currentDoc } = await supabase
        .from('documents')
        .select('view_count')
        .eq('id', docId)
        .single();

      const newCount = (currentDoc?.view_count || 0) + 1;

      await supabase
        .from('documents')
        .update({
          view_count: newCount,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('id', docId);
    }

    return data;
  } catch (err) {
    console.warn('Failed to record access timestamp:', err);
  }
}

/**
 * Permanently delete a document from both private storage and database.
 * Halts database deletion if storage removal fails.
 */
export async function deleteDocument(docId, filePath) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  // 1. Delete from private storage first
  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from('vault')
      .remove([filePath]);

    if (storageError) {
      console.error('Storage deletion failed, aborting database deletion:', storageError);
      throw new Error(`Storage deletion failed: ${storageError.message}. Database record was preserved to avoid orphaned state.`);
    }
  }

  // 2. Delete row from database only after storage deletion succeeds
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', docId);

  if (dbError) throw dbError;
  return true;
}
