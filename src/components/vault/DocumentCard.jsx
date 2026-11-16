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
  Tag,
  Clock,
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export function DocumentCard({ document, onPreview, onEdit, onDelete }) {
  const { toggleFavorite, getDocumentUrl } = useDocuments();

  const isPdf =
    document.file_type?.includes('pdf') || document.original_filename?.endsWith('.pdf');
  const isImage =
    document.file_type?.includes('image') ||
    document.original_filename?.endsWith('.png') ||
    document.original_filename?.endsWith('.jpg') ||
    document.original_filename?.endsWith('.jpeg');

  const handleDownloadClick = async (e) => {
    e.stopPropagation();
    const url = await getDocumentUrl(document);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = document.original_filename || document.title;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(document.id);
  };

  return (
    <div
      onClick={() => onPreview(document)}
      className="group relative bg-white dark:bg-navy-900/90 hover:bg-slate-50/90 dark:hover:bg-navy-850 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 sm:p-4.5 transition-all duration-200 shadow-sm hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-blue-500/5 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Bar: Icon, Favorite, Actions */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
              isPdf
                ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-500/20'
                : isImage
                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-vault-accent border border-blue-500/20'
            }`}
          >
            {isPdf ? (
              <FileText className="w-5 h-5" />
            ) : isImage ? (
              <ImageIcon className="w-5 h-5" />
            ) : (
              <File className="w-5 h-5" />
            )}
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-lg transition ${
                document.is_favorite
                  ? 'text-amber-500 dark:text-amber-400 hover:text-amber-600'
                  : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title={document.is_favorite ? 'Remove from favorites' : 'Mark as favorite'}
              aria-label={document.is_favorite ? 'Remove from favorites' : 'Mark as favorite'}
            >
              <Star className={`w-4 h-4 ${document.is_favorite ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(document);
              }}
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Edit document"
              aria-label="Edit document"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(document);
              }}
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition"
              title="Delete document"
              aria-label="Delete document"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-vault-accent transition line-clamp-1 mb-1" title={document.title}>
          {document.title}
        </h4>

        {/* Category & Subcategory */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-sky-300 text-[11px] font-medium flex items-center gap-1">
            <Folder className="w-3 h-3 text-blue-600 dark:text-vault-accent" />
            {document.category_name}
          </span>
          {document.subcategory && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] truncate max-w-[140px]">
              {document.subcategory}
            </span>
          )}
        </div>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {document.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 text-[10px] font-mono border border-slate-200 dark:border-slate-800"
              >
                #{tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="text-[10px] text-slate-500 font-mono self-center">
                +{document.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata and Quick Buttons */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-mono text-[11px]">
          {((document.file_size || 0) / (1024 * 1024)).toFixed(2)} MB
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(document);
            }}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Preview"
            aria-label="Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDownloadClick}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-vault-accent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Download"
            aria-label="Download"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
