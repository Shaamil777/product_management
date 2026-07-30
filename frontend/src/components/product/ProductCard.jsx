import React, { useState } from 'react';
import { Heart, Star, Pencil, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../utils/image';
import { toggleWishlist } from '../../api/wishlist.api';

const ProductCard = ({
  product,
  inWishlist = false,
  onWishlistChange,
  onAuthError,
  onEdit,
  onDelete,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(inWishlist);
  const [toggling, setToggling] = useState(false);

  const price =
    product?.variants && product.variants.length > 0
      ? product.variants[0].price
      : product?.price || 0;

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (toggling) return;

    const token = localStorage.getItem('token');
    if (!token) {
      onAuthError?.('Please login');
      return;
    }

    setToggling(true);
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    try {
      await toggleWishlist(product._id);
      onWishlistChange?.(product._id, nextState);
    } catch (err) {
      setIsWishlisted(!nextState);
      const msg = err?.response?.data?.message || 'Please login';
      onAuthError?.(msg);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-300 bg-white relative group flex flex-col justify-between">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const token = localStorage.getItem('token');
            if (!token) {
              onAuthError?.('Please login');
              return;
            }
            onEdit?.(product);
          }}
          className="bg-sky-100 hover:bg-sky-200 text-slate-600 hover:text-amber-600 rounded-full p-2 transition-colors duration-200 focus:outline-none cursor-pointer"
          title="Edit product"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const token = localStorage.getItem('token');
            if (!token) {
              onAuthError?.('Please login');
              return;
            }
            onDelete?.(product._id);
          }}
          className="bg-sky-100 hover:bg-sky-200 text-slate-600 hover:text-red-600 rounded-full p-2 transition-colors duration-200 focus:outline-none cursor-pointer"
          title="Delete product"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleWishlistClick}
        disabled={toggling}
        className="absolute top-4 right-4 z-10 bg-sky-100 hover:bg-sky-200 text-slate-500 hover:text-red-500 rounded-full p-2 transition-colors duration-200 focus:outline-none"
        title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-200 ${
            isWishlisted ? 'text-red-500 fill-red-500 scale-110' : ''
          }`}
        />
      </button>

      <div className="h-44 w-full flex items-center justify-center overflow-hidden rounded-xl mb-4 bg-slate-50/50 p-3">
        <img
          src={getImageUrl(product?.image)}
          alt={product?.name || 'Product'}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      <div>
        <h3
          className="text-[#003b5c] font-bold text-base truncate mb-1"
          title={product?.name}
        >
          {product?.name || 'Untitled Product'}
        </h3>

        <div className="font-extrabold text-slate-800 text-sm mb-2">
          ₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        <div className="flex items-center gap-1 text-amber-400">
          {[...Array(5)].map((_, idx) => (
            <Star
              key={idx}
              className="w-4 h-4 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
