import React, { useState, useEffect } from 'react';
import { X, Edit3, Tag, Folder, Check } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export function EditDocumentModal({ document, isOpen, onClose }) {
  const { categories, updateDoc } = useDocuments();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (document) {
      setTitle(document.title || '');
      setCategoryId(document.category_id || categories[0]?.id || '00000000-0000-0000-0000-000000000001');
      setSubcategory(document.subcategory || '');
      setTags(document.tags || []);
      setDescription(document.description || '');
    }
  }, [document, categories]);

  if (!isOpen || !document) return null;

  const currentCategory = categories.find((c) => c.id === categoryId) || categories[0];
  const subcategories = currentCategory?.subcategories || [];

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(document.id, {
        title,
        category_id: currentCategory.id,
        category_name: currentCategory.name,
        subcategory: subcategory || null,
        tags,
        description,
      });
      onClose();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-navy-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-vault-accent/20 text-vault-accent flex items-center justify-center border border-vault-accent/30">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Edit Document Metadata</h2>
            <p className="text-xs text-slate-400">Update naming, category classification, and tags</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Document Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-navy-800 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-vault-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-vault-accent" /> Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubcategory('');
                }}
                className="w-full px-3 py-2 bg-navy-800 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-vault-accent focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subcategory Slot
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 bg-navy-800 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-vault-accent focus:outline-none"
              >
                <option value="">-- General / None --</option>
                {subcategories.map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-vault-accent" /> Custom Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-blue-600/30 text-sky-200 border border-blue-500/40 text-xs flex items-center gap-1"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag and press Enter"
              className="w-full px-3 py-2 bg-navy-800 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-vault-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-navy-800 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-vault-accent focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
