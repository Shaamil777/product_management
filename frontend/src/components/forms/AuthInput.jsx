import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthInput = ({
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full mb-2.5 sm:mb-4 ${className}`}>
      <div
        className={`relative flex items-center bg-[#f0f4f3] rounded-lg transition-all duration-200 border ${
          error
            ? 'border-red-500 bg-red-50'
            : 'border-slate-200 focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20'
        }`}
      >
        {Icon && (
          <div className="pl-4 pr-3 text-slate-500 flex items-center justify-center pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full py-3 sm:py-3.5 px-3 bg-transparent text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal text-sm md:text-base focus:outline-none"
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 pl-2 text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-semibold pl-1 text-left">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;
