import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { createCategory } from '../../api/category.api';

const AddCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setError('Category name must be at least 2 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createCategory({ name: name.trim() });
      setName('');
      onSuccess?.();
      onClose();
    } catch (err) {
      const status = err?.response?.status;
      const rawMsg = err?.response?.data?.message || err?.message || '';
      const isAuthError =
        status === 401 ||
        rawMsg.toLowerCase().includes('token') ||
        rawMsg.toLowerCase().includes('authorized') ||
        rawMsg.toLowerCase().includes('auth');
      setError(
        isAuthError ? 'Please login' : rawMsg || 'Failed to create category'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-[#003b5c]">Add Category</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Laptop, Tablet, Headphones"
              className="w-full py-2.5 px-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-300 rounded-full hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-full shadow-sm transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;
