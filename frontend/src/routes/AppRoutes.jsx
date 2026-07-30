import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';

// Dashboard Pages
import Dashboard from '../pages/dashboard/Dashboard';
import Category from '../pages/category/Category';
import SubCategory from '../pages/subCategory/SubCategory';
import Product from '../pages/product/Product';
import AddProduct from '../pages/product/AddProduct';
import EditProduct from '../pages/product/EditProduct';
import Wishlist from '../pages/wishlist/Wishlist';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route index element={<Navigate to="login" replace />} />
      </Route>

      {/* Dashboard Routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="category" element={<Category />} />
        <Route path="subcategory" element={<SubCategory />} />
        <Route path="product" element={<Product />} />
        <Route path="product/add" element={<AddProduct />} />
        <Route path="product/edit/:id" element={<EditProduct />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
