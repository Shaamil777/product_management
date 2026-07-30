import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, Heart, ChevronLeft } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EditProductModal from '../../components/product/EditProductModal';
import { getProductById } from '../../api/product.api';
import { getCategories } from '../../api/category.api';
import { getSubCategories } from '../../api/subCategory.api';
import { toggleWishlist, getWishlist } from '../../api/wishlist.api';
import { getImageUrl } from '../../utils/image';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const fetchProductDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await getProductById(id);
      const prod = res?.data || res;
      setProduct(prod);
      setActiveImage(prod?.image || (prod?.images && prod.images[0]) || null);

      const prodVariants =
        prod?.variants && prod.variants.length > 0
          ? prod.variants
          : [{ ram: '8', price: prod?.price || 0, quantity: 34 }];

      setSelectedVariant(prodVariants[0]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchCategoriesAndWishlist = useCallback(async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        getCategories().catch(() => ({ data: [] })),
        getSubCategories().catch(() => ({ data: [] })),
      ]);
      setCategories(catRes?.data || []);
      setSubCategories(subRes?.data || []);

      const token = localStorage.getItem('token');
      if (token && id) {
        const wishRes = await getWishlist().catch(() => ({ data: [] }));
        const list =
          wishRes?.data?.products ||
          (Array.isArray(wishRes?.data) ? wishRes?.data : []);
        const inWish = list.some(
          (item) => item._id === id || item.id === id
        );
        setIsWishlisted(inWish);
      }
    } catch (err) {
      // ignore
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
    fetchCategoriesAndWishlist();
  }, [fetchProductDetails, fetchCategoriesAndWishlist]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      navigate('/?search=' + encodeURIComponent(term.trim()));
    }
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (togglingWishlist) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please login');
      return;
    }

    setTogglingWishlist(true);
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    try {
      await toggleWishlist(id);
    } catch (err) {
      setIsWishlisted(!nextState);
      const msg = err?.response?.data?.message || 'Please login';
      setAuthError(msg);
    } finally {
      setTogglingWishlist(false);
    }
  };

  const handleEditClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please login');
      return;
    }
    setIsEditModalOpen(true);
  };

  const handleBuyClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please login');
      return;
    }
    setSuccessMsg(
      `Order initiated for ${quantity} x ${product?.name} (${
        selectedVariant?.ram || 8
      } GB)!`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <Navbar searchTerm={searchTerm} onSearchChange={handleSearch} />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900">
        <Navbar searchTerm={searchTerm} onSearchChange={handleSearch} />
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md w-full shadow-xs">
            <h3 className="text-lg font-bold text-[#003b5c] mb-2">
              {error || 'Product not found'}
            </h3>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold text-xs py-2.5 px-6 rounded-full transition-colors flex items-center gap-1.5 mx-auto"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const variants =
    product.variants && product.variants.length > 0
      ? product.variants
      : [{ ram: '8', price: product.price || 0, quantity: 34 }];

  const currentPrice =
    selectedVariant?.price || variants[0]?.price || product.price || 0;
  const currentQuantity =
    selectedVariant?.quantity !== undefined
      ? selectedVariant.quantity
      : 34;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900 relative">
      <Navbar searchTerm={searchTerm} onSearchChange={handleSearch} />

      {authError && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 mt-4 sticky top-16 z-30">
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold rounded-lg shadow-xs flex items-center justify-between">
            <span>{authError}</span>
            <button
              type="button"
              onClick={() => setAuthError('')}
              className="text-red-500 hover:text-red-800 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 mt-4 sticky top-16 z-30">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold rounded-lg shadow-xs flex items-center justify-between">
            <span>{successMsg}</span>
            <button
              type="button"
              onClick={() => setSuccessMsg('')}
              className="text-emerald-500 hover:text-emerald-800 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col">
        <div className="flex items-center text-sm font-semibold text-slate-700 mb-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-[#003b5c] transition-colors"
          >
            Home
          </Link>
          <span className="mx-2 text-slate-400">&gt;</span>
          <span className="text-[#003b5c] font-bold">Product details</span>
          <span className="mx-2 text-slate-400">&gt;</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-2">
          <div className="lg:col-span-7 flex flex-col">
            <div className="w-full bg-white border border-slate-200 rounded-3xl p-8 flex items-center justify-center min-h-[380px] sm:min-h-[460px] shadow-xs">
              <img
                src={getImageUrl(activeImage || product.image)}
                alt={product.name}
                className="max-h-96 max-w-full object-contain transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {(product.images && product.images.length > 0
                ? product.images
                : [product.image]
              ).map((img, idx) => {
                const isSelected = (activeImage || product.image) === img;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`bg-white border-2 ${
                      isSelected
                        ? 'border-amber-500 shadow-sm'
                        : 'border-slate-200 hover:border-amber-300'
                    } rounded-2xl p-4 flex items-center justify-center h-24 sm:h-28 w-24 sm:w-28 cursor-pointer transition-all`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-start">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003b5c] mb-2">
              {product.name}
            </h1>

            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-4">
              ₹{Number(currentPrice).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-6">
              <span>Availability:</span>
              <span className="text-emerald-500 flex items-center gap-1 font-bold">
                <Check className="w-4 h-4 stroke-[3]" />
                In stock
              </span>
            </div>

            <hr className="border-slate-200 mb-6" />

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-bold text-slate-800 w-20">
                Ram:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {variants.map((v, idx) => {
                  const isSelected = selectedVariant?.ram === v.ram;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-200 border-2 border-slate-600 text-slate-900 shadow-xs'
                          : 'bg-slate-100 border border-transparent text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {v.ram} GB
                    </button>
                  );
                 })}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-bold text-slate-800 w-20">
                Quantity :
              </span>
              <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleEditClick}
                className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-3 px-7 sm:px-9 rounded-full shadow-sm transition-colors text-sm cursor-pointer"
              >
                Edit product
              </button>

              <button
                type="button"
                onClick={handleBuyClick}
                className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-3 px-7 sm:px-9 rounded-full shadow-sm transition-colors text-sm cursor-pointer"
              >
                Buy it now
              </button>

              <button
                type="button"
                onClick={handleWishlistClick}
                disabled={togglingWishlist}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                title={
                  isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
                }
              >
                <Heart
                  className={`w-6 h-6 transition-transform ${
                    isWishlisted
                      ? 'text-red-500 fill-red-500 scale-110'
                      : 'text-slate-700'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
        categories={categories}
        subCategories={subCategories}
        onSuccess={fetchProductDetails}
      />
    </div>
  );
};

export default Product;
