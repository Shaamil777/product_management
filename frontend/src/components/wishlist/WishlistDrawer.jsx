import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronRight, XCircle } from 'lucide-react';
import { getWishlist, toggleWishlist } from '../../api/wishlist.api';
import { getImageUrl } from '../../utils/image';
import LoadingSpinner from '../common/LoadingSpinner';

const WishlistDrawer = ({ isOpen, onClose, onWishlistChange }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWishlistItems = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !isOpen) return;

    setLoading(true);
    setError('');
    try {
      const res = await getWishlist();
      const wishlistProducts =
        res?.data?.products || (Array.isArray(res?.data) ? res?.data : []);
      setItems(wishlistProducts);
      onWishlistChange?.(wishlistProducts.length);
    } catch (err) {
      setError('Failed to load wishlist items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isOpen, onWishlistChange]);

  useEffect(() => {
    if (isOpen) {
      fetchWishlistItems();
    }
  }, [isOpen, fetchWishlistItems]);

  const handleRemoveItem = async (productId, e) => {
    e.stopPropagation();
    try {
      await toggleWishlist(productId);
      setItems((prev) => {
        const updated = prev.filter((item) => item._id !== productId);
        onWishlistChange?.(updated.length);
        return updated;
      });
    } catch (err) {}
  };

  const handleItemClick = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#003b5c] px-6 py-5 flex items-center justify-between text-white shrink-0 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-sm shrink-0">
              <Heart className="w-5 h-5 text-slate-800" />
            </div>
            <h3 className="text-xl font-bold text-white ml-3">Items</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white hover:opacity-80 p-1 rounded-full transition-opacity cursor-pointer flex items-center justify-center"
            title="Close wishlist"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-sm font-semibold text-red-500">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Heart className="w-14 h-14 text-slate-300 mb-3 stroke-1" />
              <p className="text-base font-bold text-slate-600">
                Your wishlist is empty
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Add items that you like to your wishlist
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between pb-6 border-b border-slate-200 last:border-b-0 last:pb-0"
                >
                  <div
                    onClick={() => handleItemClick(item._id)}
                    className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer group"
                  >
                    <div className="w-20 h-20 bg-white border border-slate-200 rounded-2xl p-2 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-amber-400 transition-colors">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-[#003b5c] group-hover:underline truncate">
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-slate-800 mt-1">
                        $
                        {Number(item.price || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleRemoveItem(item._id, e)}
                    className="text-[#003b5c] hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors ml-3 shrink-0 cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
