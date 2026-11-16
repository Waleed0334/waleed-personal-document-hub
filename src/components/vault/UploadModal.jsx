import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle2, AlertCircle, Plus, Tag, Folder } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';
import { MAX_FILE_SIZE_BYTES } from '../../constants/categories';

export function UploadModal({ isOpen, onClose, defaultCategoryId = null }) {
  const { categories, uploadFiles } = useDocuments();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(defaultCategoryId || categories[0]?.id || '00000000-0000-0000-0000-000000000001');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [customTagInput, setCustomTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState([]);
  const [successCount, setSuccessCount] = useState(0);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const subcategories = currentCategory?.subcategories || [];

  const handleFilesAdded = (files) => {
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setErrors([]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = customTagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setCustomTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setProgress(15);
    setErrors([]);

    const metadataList = selectedFiles.map((file) => ({
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: currentCategory,
      subcategory: selectedSubcategory || null,
      tags: [...tags],
      description,
    }));

    setProgress(50);
    const { uploaded, errors: uploadErrors } = await uploadFiles(selectedFiles, metadataList);
    setProgress(100);

    if (uploadErrors && uploadErrors.length > 0) {
      setErrors(uploadErrors);
    }

    if (uploaded.length > 0) {
      setSuccessCount(uploaded.length);
      setTimeout(() => {
        setUploading(false);
        onClose();
        // Reset state
        setSelectedFiles([]);
        setTags([]);
        setDescription('');
        setSuccessCount(0);
        setProgress(0);
      }, 1200);
    } else {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 dark:bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 relative my-auto max-h-[92vh] overflow-y-auto transition-colors duration-200">
        <button
          type="button"
          onClick={onClose}
          disabled={uploading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Close upload modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-vault-accent flex items-center justify-center border border-blue-500/20 dark:border-blue-500/30 shrink-0">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">Upload Private Documents</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Encrypted in private storage vault with owner-only access</p>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs space-y-1">
            {errors.map((err, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500 dark:text-rose-400" />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        {successCount > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>Successfully stored {successCount} document(s) in vault!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition ${
              isDragging
                ? 'border-blue-500 dark:border-vault-accent bg-blue-500/10'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-navy-950/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFilesAdded(e.target.files)}
            />
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-blue-600 dark:text-vault-accent mb-2" />
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
              Drop files here, or <span className="text-blue-600 dark:text-vault-accent underline font-semibold">browse</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Supports PDF, PNG, JPG, JPEG, DOCX (Max 50 MB per file)
            </p>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Selected Files ({selectedFiles.length})
              </span>
              {selectedFiles.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-navy-800 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <File className="w-4 h-4 text-blue-600 dark:text-vault-accent shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 truncate font-medium">{f.name}</span>
                    <span className="text-slate-500 shrink-0">
                      ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(idx);
                    }}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    aria-label="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-blue-600 dark:text-vault-accent" /> Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedSubcategory('');
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 dark:focus:ring-vault-accent focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subcategory (Document Slot)
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 dark:focus:ring-vault-accent focus:outline-none"
              >
                <option value="" className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">-- General / No Subcategory --</option>
                {subcategories.map((sub, idx) => (
                  <option key={idx} value={sub} className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600 dark:text-vault-accent" /> Custom Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-600/30 text-blue-700 dark:text-sky-200 border border-blue-200 dark:border-blue-500/40 text-xs flex items-center gap-1"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-500 dark:hover:text-rose-300"
                    aria-label={`Remove tag ${t}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag (e.g. FAST, Spring2025, CNIC) and press Enter"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:ring-2 focus:ring-blue-500 dark:focus:ring-vault-accent focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Important notes, verification date, or issuance details..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:ring-2 focus:ring-blue-500 dark:focus:ring-vault-accent focus:outline-none resize-none"
            />
          </div>

          {uploading && (
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-vault-accent h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || selectedFiles.length === 0}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploading ? 'Encrypting & Storing...' : `Upload ${selectedFiles.length || ''} File(s)`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
