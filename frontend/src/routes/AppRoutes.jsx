import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import Category from '../pages/category/Category';
import SubCategory from '../pages/subCategory/SubCategory';
import Product from '../pages/product/Product';
import AddProduct from '../pages/product/AddProduct';
import EditProduct from '../pages/product/EditProduct';
import Wishlist from '../pages/wishlist/Wishlist';

const SignUp = lazy(() => import('../pages/auth/SignUp'));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="flex w-full min-h-[60vh] justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="category" element={<Category />} />
          <Route path="subcategory" element={<SubCategory />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="product/add" element={<AddProduct />} />
          <Route path="product/edit/:id" element={<EditProduct />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
