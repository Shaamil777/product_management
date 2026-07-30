import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthBanner = ({
  title = 'Welcome Back!',
  subtitle = 'To keep connected with us please login with your personal info',
  buttonText = 'SIGN IN',
  navigateTo = '/auth/login',
  isRightSide = false,
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <div className={`relative overflow-hidden w-full lg:w-5/12 bg-gradient-to-b from-[#064266] via-[#053b5c] to-[#042841] text-white flex flex-col justify-center items-center py-6 px-6 sm:py-8 sm:px-8 lg:p-12 h-auto shrink-0 lg:h-full select-none ${className}`}>
      <div className="absolute top-10 left-1/4 w-16 h-16 bg-[#0a527c]/40 rotate-45 rounded-sm pointer-events-none transform -translate-x-1/2" />
      <div className="absolute top-1/3 -right-12 w-48 h-48 bg-[#0a527c]/30 rotate-12 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-[#0a527c]/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-16 left-3/4 w-12 h-6 bg-[#0a527c]/50 -rotate-45 rounded-xs pointer-events-none" />

      <div className="relative z-10 max-w-sm text-center flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold tracking-tight mb-2 sm:mb-3 lg:mb-4 text-white">
          {title}
        </h2>
        
        <p className="text-xs sm:text-sm lg:text-base text-slate-200/90 leading-relaxed mb-4 sm:mb-6 lg:mb-8 px-2 font-light max-w-xs sm:max-w-sm">
          {subtitle}
        </p>

        <button
          type="button"
          onClick={() => navigate(navigateTo)}
          className="border-2 border-white text-white font-semibold text-xs md:text-sm tracking-widest uppercase py-2.5 px-8 sm:py-3 sm:px-12 rounded-full hover:bg-white hover:text-[#053b5c] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default AuthBanner;
