import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthMode } from '@/types';

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitting ${authMode} form`, { email, password });
    // Navigate to profile after login
    navigate('/profile');
  };

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 bg-white dark:bg-[#111a22] overflow-y-auto">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        {/* Headline */}
        <div className="text-center pb-2">
          <h1 className="text-[#0d141b] dark:text-white tracking-light text-[32px] font-bold leading-tight">
            {authMode === AuthMode.LOGIN ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-2">
            {authMode === AuthMode.LOGIN
              ? 'Please enter your details to sign in.'
              : 'Enter your details to get started.'}
          </p>
        </div>

        {/* Segmented Tabs */}
        <div className="flex w-full">
          <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-[#e7edf3] dark:bg-[#202934] p-1">
            {Object.values(AuthMode).map((mode) => (
              <label
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-sm font-bold leading-normal transition-all duration-200 ${
                  authMode === mode
                    ? 'bg-white dark:bg-[#2f3b4b] shadow-sm text-primary'
                    : 'text-[#4c739a] dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <span className="truncate">{mode}</span>
                <input
                  type="radio"
                  name="auth_mode"
                  value={mode}
                  checked={authMode === mode}
                  onChange={() => {}}
                  className="invisible w-0 absolute"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col w-full gap-2">
            <span className="text-[#0d141b] dark:text-gray-200 text-sm font-bold leading-normal">
              Email address
            </span>
            <input
              type="email"
              className="flex w-full resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary border border-[#cfdbe7] dark:border-[#3e4a5b] bg-slate-50 dark:bg-[#1a232d] h-12 px-4 placeholder:text-[#93adc8] text-base font-normal leading-normal transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col w-full gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[#0d141b] dark:text-gray-200 text-sm font-bold leading-normal">
                Password
              </span>
              {authMode === AuthMode.LOGIN && (
                <a href="#" className="text-primary text-sm font-bold hover:underline">
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                className="flex w-full resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary border border-[#cfdbe7] dark:border-[#3e4a5b] bg-slate-50 dark:bg-[#1a232d] h-12 pl-4 pr-10 placeholder:text-[#93adc8] text-base font-normal leading-normal transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 text-[#93adc8] hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-[20px] select-none">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
            >
              <span className="truncate">Continue</span>
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center select-none">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-sm font-medium">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 rounded-lg border border-[#cfdbe7] dark:border-[#3e4a5b] bg-white dark:bg-[#202934] h-12 px-4 hover:bg-slate-50 dark:hover:bg-[#2f3b4b] transition-colors group">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.81H12V14.45H18.46C18.18 15.93 17.32 17.18 16.05 18.03V21.01H19.93C22.2 18.92 23.52 15.84 23.52 12.29Z" fill="#4285F4"/>
              <path d="M12 24C15.24 24 17.96 22.92 19.93 21.1L16.05 18.03C14.97 18.75 13.59 19.18 12 19.18C8.87 19.18 6.22 17.07 5.27 14.24H1.26V17.35C3.25 21.31 7.34 24 12 24Z" fill="#34A853"/>
              <path d="M5.27 14.24C5.03 13.52 4.9 12.77 4.9 12C4.9 11.23 5.03 10.48 5.27 9.76V6.65H1.26C0.45 8.26 0 10.07 0 12C0 13.93 0.45 15.74 1.26 17.35L5.27 14.24Z" fill="#FBBC05"/>
              <path d="M12 4.82C13.76 4.82 15.34 5.43 16.58 6.61L20.04 3.15C17.96 1.2 15.24 0 12 0C7.34 0 3.25 2.69 1.26 6.65L5.27 9.76C6.22 6.93 8.87 4.82 12 4.82Z" fill="#EA4335"/>
            </svg>
            <span className="text-[#0d141b] dark:text-white text-sm font-bold">Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 rounded-lg border border-[#cfdbe7] dark:border-[#3e4a5b] bg-white dark:bg-[#202934] h-12 px-4 hover:bg-slate-50 dark:hover:bg-[#2f3b4b] transition-colors group">
            <svg className="w-6 h-6 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"></path>
            </svg>
            <span className="text-[#0d141b] dark:text-white text-sm font-bold">Facebook</span>
          </button>
        </div>

        {/* Footer text */}
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-4">
          {authMode === AuthMode.LOGIN
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            type="button"
            onClick={() => handleModeChange(authMode === AuthMode.LOGIN ? AuthMode.SIGNUP : AuthMode.LOGIN)}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            {authMode === AuthMode.LOGIN ? 'Sign up' : 'Log in'}
          </button>
        </p>
        <p className="text-xs text-center text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
          By signing in, you agree to our{' '}
          <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

