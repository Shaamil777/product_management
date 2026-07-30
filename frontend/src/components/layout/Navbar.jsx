import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, User, LogOut } from 'lucide-react';
import { getWishlist } from '../../api/wishlist.api';
import WishlistDrawer from '../wishlist/WishlistDrawer';

const Navbar = ({ searchTerm = '', onSearchChange }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(''), 2500);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        setUser(null);
      }
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetchWishlistCount();
    }
  }, []);

  const fetchWishlistCount = async () => {
    try {
      const res = await getWishlist();
      const items =
        res?.data?.products || (Array.isArray(res?.data) ? res?.data : []);
      setWishlistCount(items.length);
    } catch (err) {
      setWishlistCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setWishlistCount(0);
    navigate('/auth/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleWishlistClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError('Please login');
      return;
    }
    setIsWishlistDrawerOpen(true);
  };

  return (
    <>
      <header className="w-full bg-[#042841] text-white py-3 px-4 sm:px-8 shadow-md sticky top-0 z-40">
        {authError && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full shadow-lg animate-in fade-in zoom-in duration-200">
            {authError}
          </div>
        )}

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-extrabold tracking-tight text-white hover:opacity-90 transition-opacity shrink-0"
          >
            Product <span className="text-amber-400">Manage</span>
          </Link>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-4 relative"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search product..."
              className="w-full bg-white text-slate-800 text-sm font-medium py-2.5 pl-5 pr-28 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs sm:text-sm px-6 rounded-full transition-colors shadow-xs cursor-pointer"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-6 sm:gap-8">
            <button
              type="button"
              onClick={handleWishlistClick}
              className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors cursor-pointer group"
            >
              <div className="relative flex items-center justify-center">
                <Heart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-1 -right-2 bg-amber-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#042841]">
                  {wishlistCount}
                </span>
              </div>
              <span className="text-sm font-medium ml-1">Wishlist</span>
            </button>

            <div className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                <span className="absolute -bottom-1 -right-2 bg-amber-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#042841]">
                  0
                </span>
              </div>
              <span className="text-sm font-medium ml-1">Cart</span>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-700/80">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-amber-400">
                    {user.name?.split(' ')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-red-400 text-xs font-semibold transition-colors bg-[#031d30] py-1.5 px-3.5 rounded-full"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/auth/login')}
                    className="text-slate-200 hover:text-amber-400 text-xs sm:text-sm font-semibold py-1.5 px-3 rounded-full transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/auth/signup')}
                    className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs sm:text-sm font-bold py-1.5 px-4 rounded-full transition-colors shadow-xs cursor-pointer"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search product..."
              className="w-full bg-white text-slate-800 text-sm font-medium py-2 px-4 pr-24 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs py-1 px-5 rounded-full transition-colors shadow-xs"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        onWishlistChange={(count) => setWishlistCount(count)}
      />
    </>
  );
};

export default Navbar;
