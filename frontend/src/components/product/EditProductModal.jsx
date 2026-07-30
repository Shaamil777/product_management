import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { updateProduct } from '../../api/product.api';
import { getImageUrl } from '../../utils/image';

const EditProductModal = ({
  isOpen,
  onClose,
  product,
  categories = [],
  subCategories = [],
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    price: '',
    ram: '8',
    quantity: '10',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (product) {
      const firstVariant =
        product.variants && product.variants.length > 0
          ? product.variants[0]
          : {};
      const catId =
        typeof product.category === 'object'
          ? product.category?._id
          : product.category;
      const subCatId =
        typeof product.subCategory === 'object'
          ? product.subCategory?._id
          : product.subCategory;

      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: catId || '',
        subCategory: subCatId || '',
        price: String(firstVariant.price || product.price || ''),
        ram: String(firstVariant.ram || '8'),
        quantity: String(firstVariant.quantity || '10'),
      });
      setImagePreview(getImageUrl(product.image));
      setImageFile(null);
      setError('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const filteredSubCategories = subCategories.filter(
    (sub) =>
      sub.category === formData.category ||
      sub.category?._id === formData.category ||
      sub.category?.id === formData.category
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        setImageFile(null);
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim().length < 3) {
      setError('Product name must be at least 3 characters');
      return;
    }
    if (formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    if (!formData.subCategory) {
      setError('Please select a subcategory');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    const fd = new FormData();
    fd.append('name', formData.name.trim());
    fd.append('description', formData.description.trim());
    fd.append('category', formData.category);
    fd.append('subCategory', formData.subCategory);
    fd.append(
      'variants',
      JSON.stringify([
        {
          ram: String(formData.ram).trim() || '8',
          price: Number(formData.price),
          quantity: Number(formData.quantity) || 1,
        },
      ])
    );
    if (imageFile) {
      fd.append('image', imageFile);
    }

    try {
      await updateProduct(product._id, fd);
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
        isAuthError ? 'Please login' : rawMsg || 'Failed to update product'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-[#003b5c]">Edit Product</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Acer Aspire Go 15"
              className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed description of the product..."
              rows={3}
              className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                    subCategory: '',
                  }));
                }}
                className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-amber-500 bg-white"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Subcategory *
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                disabled={!formData.category}
                className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-amber-500 bg-white disabled:bg-slate-100"
                required
              >
                <option value="">Select Subcategory</option>
                {filteredSubCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="45000"
                className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                RAM (GB) *
              </label>
              <input
                type="number"
                min="1"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                placeholder="8"
                className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="10"
                className="w-full py-2 px-3 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Product Image (Multer Upload)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-amber-500 transition-colors cursor-pointer bg-slate-50 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-28 object-contain rounded-lg mb-2"
                  />
                  <span className="text-xs text-slate-600 font-medium">
                    Click to replace image
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <Upload className="w-8 h-8 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">
                    Click or drag image to replace
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    PNG, JPG, WEBP up to 2MB
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
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
              className="px-6 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-full transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading && <LoadingSpinner size="sm" />}
              <span>Update Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
