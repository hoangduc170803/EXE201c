import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader: React.FC = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf3] dark:border-b-[#2a3441] px-6 lg:px-10 py-3 bg-white dark:bg-[#111a22] z-20 sticky top-0">
      <Link to="/" className="flex items-center gap-4 text-[#0d141b] dark:text-white cursor-pointer">
        <div className="size-8 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined !text-3xl select-none">travel_explore</span>
        </div>
        <h2 className="text-[#0d141b] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
          StayEase
        </h2>
      </Link>

      <div className="flex flex-1 justify-end gap-8">
        <nav className="hidden md:flex items-center gap-9">
          <Link className="text-[#0d141b] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors" to="/">
            Home
          </Link>
          <Link className="text-[#0d141b] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors" to="#">
            Stays
          </Link>
          <Link className="text-[#0d141b] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors" to="#">
            Experiences
          </Link>
        </nav>
        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7edf3] dark:bg-[#2a3441] text-[#0d141b] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <span className="truncate">Help</span>
        </button>
      </div>
    </header>
  );
};

export default AuthHeader;

