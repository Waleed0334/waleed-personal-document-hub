import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  FileText,
  Calendar,
  Eye,
  Tag,
  Folder,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  File,
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export function DocumentViewerModal({ document, isOpen, onClose, onEdit }) {
  const { getDocumentUrl, recordAccess } = useDocuments();
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!document || !isOpen) {
      setFileUrl(null);
      setZoomLevel(1);
      setRotation(0);
      return;
    }

    setLoading(true);
    setError(null);

    // Record access count and last_accessed timestamp
    recordAccess(document.id);

    getDocumentUrl(document)
      .then((url) => {
        setFileUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to generate secure preview URL.');
        setLoading(false);
      });
  }, [document, isOpen]);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !document) return null;

  const isPdf =
    document.file_type?.includes('pdf') || document.original_filename?.endsWith('.pdf');
  const isImage =
    document.file_type?.includes('image') ||
    document.original_filename?.endsWith('.png') ||
    document.original_filename?.endsWith('.jpg') ||
    document.original_filename?.endsWith('.jpeg');

  const handleDownload = () => {
    if (!fileUrl) return;
    const a = window.document.createElement('a');
    a.href = fileUrl;
    a.download = document.original_filename || document.title;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-6xl h-[90vh] bg-navy-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        {/* Main Preview Area */}
        <div className="flex-1 flex flex-col bg-navy-950 border-b md:border-b-0 md:border-r border-slate-800 relative overflow-hidden">
          {/* Preview Header / Controls */}
          <div className="p-3 bg-navy-900/90 border-b border-slate-800 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 truncate">
              <span className="p-1.5 rounded-lg bg-blue-600/20 text-vault-accent">
                {isPdf ? <FileText className="w-4 h-4" /> : <File className="w-4 h-4" />}
              </span>
              <span className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md">
                {document.title}
              </span>
            </div>

            {/* Image zoom controls */}
            {isImage && (
              <div className="flex items-center gap-1.5 bg-navy-800 px-2 py-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  className="p-1 text-slate-400 hover:text-white rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-slate-300 font-mono w-10 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                  className="p-1 text-slate-400 hover:text-white rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1 text-slate-400 hover:text-white rounded ml-1"
                  title="Rotate"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Viewer Content Frame */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto relative">
            {loading ? (
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-vault-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-400 font-mono">Generating temporary signed token...</p>
              </div>
            ) : error ? (
              <div className="text-center max-w-sm p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-400" />
                <p>{error}</p>
              </div>
            ) : isPdf ? (
              <iframe
                src={`${fileUrl}#toolbar=1&navpanes=0`}
                title={document.title}
                className="w-full h-full rounded-lg border border-slate-800 shadow-inner bg-slate-900"
              />
            ) : isImage ? (
              <div className="overflow-auto flex items-center justify-center w-full h-full">
                <img
                  src={fileUrl}
                  alt={document.title}
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease',
                  }}
                  className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-lg"
                />
              </div>
            ) : (
              <div className="text-center p-8 bg-navy-900 rounded-2xl border border-slate-800 max-w-md">
                <File className="w-12 h-12 text-vault-accent mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-white mb-1">
                  Preview not directly renderable
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  This document ({document.original_filename}) is formatted for download and local application viewing.
                </p>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 mx-auto"
                >
                  <Download className="w-4 h-4" /> Download File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Metadata & Actions Drawer */}
        <div className="w-full md:w-80 bg-navy-900 flex flex-col p-5 overflow-y-auto">
          <div className="hidden md:flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Document Details
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs flex-1">
            {/* Title & Category */}
            <div>
              <h3 className="text-base font-bold text-white mb-1 break-words">{document.title}</h3>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-sky-300 font-medium flex items-center gap-1">
                  <Folder className="w-3 h-3" /> {document.category_name}
                </span>
                {document.subcategory && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                    {document.subcategory}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {document.description && (
              <div className="p-3 bg-navy-950/60 rounded-xl border border-slate-800">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                  Notes
                </span>
                <p className="text-slate-300 leading-relaxed break-words">{document.description}</p>
              </div>
            )}

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1.5">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1">
                  {document.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* File Details Grid */}
            <div className="border-t border-slate-800 pt-3 space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Original File:</span>
                <span className="text-slate-200 font-mono truncate max-w-[150px]">
                  {document.original_filename}
                </span>
              </div>
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="text-slate-200">
                  {((document.file_size || 0) / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              <div className="flex justify-between">
                <span>Uploaded:</span>
                <span className="text-slate-200">
                  {new Date(document.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Views:</span>
                <span className="text-slate-200">{document.view_count || 1}</span>
              </div>
              {document.last_accessed_at && (
                <div className="flex justify-between">
                  <span>Last Accessed:</span>
                  <span className="text-slate-200">
                    {new Date(document.last_accessed_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Security note */}
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Short-lived private token active</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Document
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEdit) onEdit(document);
              }}
              className="w-full py-2 bg-navy-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition"
            >
              Edit Metadata &amp; Tags
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
