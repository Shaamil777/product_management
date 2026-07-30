import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import AuthInput from '../../components/forms/AuthInput';
import AuthBanner from '../../components/auth/AuthBanner';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { register } from '../../api/auth.api';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific backend error as the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setServerError('');
    setSuccessMessage('');

    try {
      const res = await register(formData);
      const token = res?.data?.token || res?.token;
      const user = res?.data?.user || res?.user;

      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      setSuccessMessage('Account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      const responseData = err?.response?.data;

      // Handle backend Zod / field-level validation error array in priority order
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        const fieldErrors = {};
        responseData.errors.forEach((item) => {
          if (item.field && !fieldErrors[item.field]) {
            if (!formData[item.field] && (item.field === 'name' || item.field === 'email' || item.field === 'password')) {
              const fieldName = item.field.charAt(0).toUpperCase() + item.field.slice(1);
              fieldErrors[item.field] = `${fieldName} is required`;
            } else {
              fieldErrors[item.field] = item.message;
            }
          }
        });
        setErrors(fieldErrors);
      } else {
        // Handle general error messages (e.g. Email already registered, server error)
        const msg =
          responseData?.message ||
          err?.message ||
          'Failed to create account. Please try again.';
        setServerError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-dvh max-h-dvh bg-white flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Dark Navy Blue Welcome Back Banner */}
        <AuthBanner
          title="Welcome Back!"
          subtitle="To keep connected with us please login with your personal info"
          buttonText="SIGN IN"
          navigateTo="/auth/login"
        />

        {/* Right Side: White Create Account Form */}
        <div className="w-full lg:w-7/12 flex-1 flex flex-col justify-center items-center px-4 py-4 sm:px-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-sm text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-500 mb-4 sm:mb-6 lg:mb-8 tracking-tight">
              Create Account
            </h1>

            {serverError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium rounded-lg text-left shadow-xs">
                {serverError}
              </div>
            )}

            {successMessage && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm font-medium rounded-lg text-left shadow-xs">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="w-full">
              <AuthInput
                icon={User}
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />

              <AuthInput
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <AuthInput
                icon={Lock}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              <div className="mt-4 sm:mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-48 py-3 px-6 rounded-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'SIGN UP'}
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
};


export default SignUp;
