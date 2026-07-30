import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PackageOpen, Plus } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import CategorySidebar from '../../components/product/CategorySidebar';
import ProductCard from '../../components/product/ProductCard';
import AddCategoryModal from '../../components/product/AddCategoryModal';
import AddSubCategoryModal from '../../components/product/AddSubCategoryModal';
import AddProductModal from '../../components/product/AddProductModal';
import EditProductModal from '../../components/product/EditProductModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getCategories, deleteCategory } from '../../api/category.api';
import { getSubCategories, deleteSubCategory } from '../../api/subCategory.api';
import { getProducts, deleteProduct } from '../../api/product.api';
import { getWishlist } from '../../api/wishlist.api';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  const handleOpenModal = (openFn) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please login');
      return;
    }
    openFn(true);
  };

  const handleEditProduct = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please login');
      return;
    }
    setEditingProduct(product);
    setIsEditProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please login');
      return;
    }
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchAllData();
      } catch (err) {
        setAuthError(err?.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please login');
      return;
    }
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        if (selectedCategory === categoryId) setSelectedCategory(null);
        fetchAllData();
      } catch (err) {
        setAuthError(err?.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleDeleteSubCategory = async (subCategoryId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please login');
      return;
    }
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await deleteSubCategory(subCategoryId);
        if (selectedSubCategory === subCategoryId) setSelectedSubCategory(null);
        fetchAllData();
      } catch (err) {
        setAuthError(err?.response?.data?.message || 'Failed to delete subcategory');
      }
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, subRes, prodRes] = await Promise.all([
        getCategories().catch(() => ({ data: [] })),
        getSubCategories().catch(() => ({ data: [] })),
        getProducts().catch(() => ({ data: [] })),
      ]);

      const catData = catRes?.data?.categories || catRes?.data || [];
      setCategories(Array.isArray(catData) ? catData : []);

      const subData = subRes?.data?.subCategories || subRes?.data || [];
      setSubCategories(Array.isArray(subData) ? subData : []);

      const prodData = prodRes?.data?.products || prodRes?.data || [];
      setProducts(Array.isArray(prodData) ? prodData : []);

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const wishRes = await getWishlist();
          const items =
            wishRes?.data?.products ||
            (Array.isArray(wishRes?.data) ? wishRes?.data : []);
          const ids = items.map(
            (w) => w._id || w.id || w.product?._id || w.product
          );
          setWishlistIds(ids);
        } catch (e) {
          setWishlistIds([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((item) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      if (selectedCategory) {
        const itemCat = item.category?._id || item.category;
        if (itemCat !== selectedCategory) return false;
      }

      if (selectedSubCategory) {
        const itemSub = item.subCategory?._id || item.subCategory;
        if (itemSub !== selectedSubCategory) return false;
      }

      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedSubCategory]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, currentPage]);

  const handleWishlistChange = (productId, isAdded) => {
    setWishlistIds((prev) =>
      isAdded ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900 relative">
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

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

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center text-sm font-semibold text-slate-700">
            <span className="text-[#003b5c] font-bold">Home</span>
            <span className="mx-2 text-slate-400">&gt;</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenModal(setIsCategoryModalOpen)}
              className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold text-xs sm:text-sm py-2 px-5 rounded-full transition-colors shadow-xs"
            >
              Add category
            </button>

            <button
              type="button"
              onClick={() => handleOpenModal(setIsSubCategoryModalOpen)}
              className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold text-xs sm:text-sm py-2 px-5 rounded-full transition-colors shadow-xs"
            >
              Add sub category
            </button>

            <button
              type="button"
              onClick={() => handleOpenModal(setIsProductModalOpen)}
              className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold text-xs sm:text-sm py-2 px-5 rounded-full transition-colors shadow-xs"
            >
              Add product
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start flex-1">
          <CategorySidebar
            categories={categories}
            subCategories={subCategories}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onSelectCategory={(id) => {
              setSelectedCategory(id);
              setSelectedSubCategory(null);
              setCurrentPage(1);
            }}
            onSelectSubCategory={(id) => {
              setSelectedSubCategory(id);
              setCurrentPage(1);
            }}
            onResetFilters={handleResetFilters}
            onDeleteCategory={handleDeleteCategory}
            onDeleteSubCategory={handleDeleteSubCategory}
            onAuthError={(msg) => setAuthError(msg)}
          />

          <main className="flex-1 w-full">
            {loading ? (
              <div className="w-full h-80 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((prod) => (
                  <ProductCard
                    key={prod._id}
                    product={prod}
                    inWishlist={wishlistIds.includes(prod._id)}
                    onWishlistChange={handleWishlistChange}
                    onAuthError={(msg) => setAuthError(msg)}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full bg-white border border-slate-200 rounded-2xl py-16 px-6 text-center flex flex-col items-center justify-center shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#003b5c] mb-1">
                  No product
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mb-6">
                  No product
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenModal(setIsProductModalOpen)}
                  className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs py-2.5 px-6 rounded-full shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add product</span>
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors flex items-center justify-center ${
                          isCurrent
                            ? 'bg-amber-500 text-white'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="font-bold text-slate-800 bg-slate-200/80 px-2 py-1 rounded text-xs">
                    10 items / page
                  </span>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={fetchAllData}
      />

      <AddSubCategoryModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => setIsSubCategoryModalOpen(false)}
        categories={categories}
        onSuccess={fetchAllData}
      />

      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        categories={categories}
        subCategories={subCategories}
        onSuccess={fetchAllData}
      />

      <EditProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => {
          setIsEditProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
        subCategories={subCategories}
        onSuccess={fetchAllData}
      />
    </div>
  );
};

export default Dashboard;
