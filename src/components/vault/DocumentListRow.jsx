import React from 'react';
import {
  FileText,
  Image as ImageIcon,
  File,
  Star,
  Eye,
  Download,
  Edit,
  Trash2,
  Folder,
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export function DocumentListRow({ document, onPreview, onEdit, onDelete }) {
  const { toggleFavorite, getDocumentUrl } = useDocuments();

  const isPdf =
    document.file_type?.includes('pdf') || document.original_filename?.endsWith('.pdf');
  const isImage =
    document.file_type?.includes('image') ||
    document.original_filename?.endsWith('.png') ||
    document.original_filename?.endsWith('.jpg') ||
    document.original_filename?.endsWith('.jpeg');

  const handleDownload = async (e) => {
    e.stopPropagation();
    const url = await getDocumentUrl(document);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = document.original_filename || document.title;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  return (
    <div
      onClick={() => onPreview(document)}
      className="group flex items-center justify-between p-2.5 sm:p-3.5 bg-white dark:bg-navy-900 hover:bg-slate-50 dark:hover:bg-navy-850 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl transition cursor-pointer gap-2 sm:gap-4 text-xs shadow-sm"
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(document.id);
          }}
          className={`p-1 rounded transition shrink-0 ${
            document.is_favorite ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          aria-label={document.is_favorite ? 'Remove from favorites' : 'Mark as favorite'}
        >
          <Star className={`w-4 h-4 ${document.is_favorite ? 'fill-current' : ''}`} />
        </button>

        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isPdf
              ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
              : isImage
              ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
              : 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-vault-accent'
          }`}
        >
          {isPdf ? (
            <FileText className="w-4 h-4" />
          ) : isImage ? (
            <ImageIcon className="w-4 h-4" />
          ) : (
            <File className="w-4 h-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h5 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-vault-accent truncate">
            {document.title}
          </h5>
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono truncate block">
            {document.original_filename}
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-sky-300 font-medium">
          {document.category_name}
        </span>
        {document.subcategory && (
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
            {document.subcategory}
          </span>
        )}
      </div>

      <div className="hidden md:block text-slate-500 dark:text-slate-400 shrink-0 font-mono text-[11px]">
        {((document.file_size || 0) / (1024 * 1024)).toFixed(2)} MB
      </div>

      <div className="hidden lg:block text-slate-500 dark:text-slate-400 shrink-0 text-[11px]">
        {new Date(document.created_at).toLocaleDateString()}
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPreview(document);
          }}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Preview"
          aria-label="Preview"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-vault-accent rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Download"
          aria-label="Download"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(document);
          }}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Edit"
          aria-label="Edit"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(document);
          }}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition"
          title="Delete"
          aria-label="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
