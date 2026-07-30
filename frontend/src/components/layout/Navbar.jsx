import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, User, LogOut } from 'lucide-react';
import { getWishlist } from '../../api/wishlist.api';

const Navbar = ({ searchTerm = '', onSearchChange }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);

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
      const items = res?.data || [];
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

  return (
    <header className="w-full bg-[#042841] text-white py-3 px-4 sm:px-8 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full sm:w-auto flex-1 max-w-lg relative flex items-center bg-white rounded-full p-1 shadow-sm"
        >
          <input
            type="text"
            placeholder="Search any things"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full py-1.5 px-4 bg-transparent text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold text-xs sm:text-sm py-2 px-6 sm:px-8 rounded-full transition-colors shadow-xs shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-8 sm:gap-10">
          <Link
            to="/wishlist"
            className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <div className="relative flex items-center justify-center">
              <Heart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-1 -right-2 bg-amber-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#042841]">
                {wishlistCount}
              </span>
            </div>
            <span className="text-sm font-medium ml-1">Wishlist</span>
          </Link>

          <div className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-1 -right-2 bg-amber-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#042841]">
                0
              </span>
            </div>
            <span className="text-sm font-medium ml-1">Cart</span>
          </div>

          <div className="flex items-center gap-3 ml-3 sm:ml-6 pl-4 border-l border-slate-700/80">
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
    </header>
  );
};

export default Navbar;
