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
  });

  const [variants, setVariants] = useState([
    { ram: '4', price: '529.99', quantity: 1 },
  ]);

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
      });

      const prodVariants =
        product.variants && product.variants.length > 0
          ? product.variants.map((v) => ({
              ram: String(v.ram || '8'),
              price: String(v.price || product.price || '0'),
              quantity: Number(v.quantity || 10),
            }))
          : [{ ram: '8', price: String(product.price || '0'), quantity: 10 }];

      setVariants(prodVariants);
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

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setError('');
  };

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { ram: '16', price: '', quantity: 1 }]);
  };

  const handleRemoveVariant = (index) => {
    setVariants((prev) => prev.filter((_, idx) => idx !== index));
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

    const validVariants = variants.map((v) => ({
      ram: String(v.ram).trim() || '8',
      price: Number(v.price) || 0,
      quantity: Number(v.quantity) || 0,
    }));

    if (validVariants.some((v) => !v.ram || v.price <= 0)) {
      setError('Please provide a valid RAM and Price (> 0) for each variant');
      return;
    }

    setLoading(true);
    setError('');

    const fd = new FormData();
    fd.append('name', formData.name.trim());
    fd.append('description', formData.description.trim());
    fd.append('category', formData.category);
    fd.append('subCategory', formData.subCategory);
    fd.append('variants', JSON.stringify(validVariants));
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
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl relative animate-in fade-in zoom-in duration-200 max-h-[92vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-700 text-center mb-8">
          Edit Product
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-semibold rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="w-32 shrink-0 text-sm font-medium text-slate-400">
              Title :
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="HP AMD Ryzen 3"
              className="flex-1 py-2.5 px-4 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <label className="w-32 shrink-0 text-sm font-medium text-slate-400 pt-2.5">
              Description :
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              placeholder="Detailed description (min 10 characters)"
              className="flex-1 py-2.5 px-4 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="w-32 shrink-0 text-sm font-medium text-slate-400">
              Category :
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                handleChange(e);
                setFormData((prev) => ({ ...prev, subCategory: '' }));
              }}
              className="flex-1 py-2.5 px-4 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="w-32 shrink-0 text-sm font-medium text-slate-400">
              Sub category :
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              disabled={!formData.category}
              className="flex-1 py-2.5 px-4 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 disabled:bg-slate-50 cursor-pointer"
              required
            >
              <option value="">-- Select Subcategory --</option>
              {filteredSubCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <label className="w-32 shrink-0 text-sm font-medium text-slate-400 pt-2">
              Variants :
            </label>
            <div className="flex-1 space-y-2">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap items-center gap-1.5 sm:gap-2"
                >
                  <span className="text-xs font-medium text-slate-400">
                    Ram:
                  </span>
                  <input
                    type="text"
                    value={v.ram}
                    onChange={(e) =>
                      handleVariantChange(idx, 'ram', e.target.value)
                    }
                    placeholder="4"
                    className="w-16 sm:w-20 py-1.5 px-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 text-center bg-white focus:outline-none focus:border-amber-500"
                    required
                  />

                  <span className="text-xs font-medium text-slate-400 ml-1">
                    Price:
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={v.price}
                    onChange={(e) =>
                      handleVariantChange(idx, 'price', e.target.value)
                    }
                    placeholder="529.99"
                    className="w-24 sm:w-28 py-1.5 px-2 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 text-center bg-white focus:outline-none focus:border-amber-500"
                    required
                  />

                  <span className="text-xs font-medium text-slate-400 ml-1">
                    QTY:
                  </span>
                  <div className="flex items-center justify-between border border-slate-300 rounded-xl px-2 py-1 bg-white w-24">
                    <button
                      type="button"
                      onClick={() =>
                        handleVariantChange(
                          idx,
                          'quantity',
                          Math.max(0, Number(v.quantity) - 1)
                        )
                      }
                      className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold text-xs"
                    >
                      &lt;
                    </button>
                    <span className="text-sm font-semibold text-slate-700">
                      {v.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleVariantChange(
                          idx,
                          'quantity',
                          Number(v.quantity) + 1
                        )
                      }
                      className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 font-bold text-xs"
                    >
                      &gt;
                    </button>
                  </div>

                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="text-slate-300 hover:text-red-500 p-1 ml-1 cursor-pointer"
                      title="Remove variant"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddVariant}
                className="bg-slate-800 hover:bg-slate-900 active:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors ml-auto block shadow-xs cursor-pointer mt-2"
              >
                Add variants
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
            <label className="w-32 shrink-0 text-sm font-medium text-slate-400">
              Upload image:
            </label>
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <div className="w-20 h-20 border border-slate-300 rounded-xl p-1.5 flex items-center justify-center bg-white shadow-2xs relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
              ) : null}

              <label className="w-20 h-20 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl flex items-center justify-center cursor-pointer transition-colors bg-white relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-slate-400 hover:text-amber-500 text-2xl font-bold">
                  +
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 border border-slate-300 rounded-full hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-2.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-full transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
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
