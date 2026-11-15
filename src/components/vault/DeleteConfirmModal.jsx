import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export function DeleteConfirmModal({ document, isOpen, onClose }) {
  const { deleteDoc } = useDocuments();
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !document) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoc(document.id);
      onClose();
    } catch (err) {
      alert(`Deletion error: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-navy-900 border border-rose-500/30 rounded-2xl shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">Delete Document Permanently?</h3>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          You are about to permanently remove <strong className="text-white">"{document.title}"</strong> ({document.original_filename}) from your private vault.
        </p>

        <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1 mb-6">
          <p>• The object will be purged from private Supabase Storage.</p>
          <p>• All metadata, tags, and category mappings will be deleted.</p>
          <p className="text-rose-400 font-semibold">• This operation cannot be undone.</p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? 'Purging...' : 'Permanently Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
