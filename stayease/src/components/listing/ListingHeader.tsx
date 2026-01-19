import React from 'react';
import { Link } from 'react-router-dom';

const ListingHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7edf3] dark:border-gray-700 bg-white dark:bg-[#1A2633] px-4 md:px-10 py-3 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-4 text-primary cursor-pointer">
          <div className="size-8 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl">travel_explore</span>
          </div>
          <h2 className="text-[#0d141b] dark:text-white text-xl font-black leading-tight tracking-[-0.015em] hidden md:block">
            StayEase
          </h2>
        </Link>
        
        {/* Search Bar (Desktop) */}
        <label className="hidden md:flex flex-col min-w-40 !h-12 max-w-80">
          <div className="flex w-full flex-1 items-stretch rounded-full h-full shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-full text-[#0d141b] dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-[#4c739a] px-6 text-sm font-medium leading-normal"
              placeholder="Start your search"
              defaultValue=""
            />
            <div className="text-white flex border-none bg-primary items-center justify-center rounded-full size-10 m-1 cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
          </div>
        </label>
      </div>

      <div className="flex flex-1 justify-end gap-2 md:gap-8 items-center">
        <div className="hidden lg:flex items-center gap-6">
          <Link
            className="text-[#0d141b] dark:text-gray-200 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-full transition-colors"
            to="/"
          >
            Stays
          </Link>
          <a
            className="text-[#4c739a] dark:text-gray-400 text-sm font-medium hover:text-[#0d141b] dark:hover:text-white transition-colors"
            href="#"
          >
            Experiences
          </a>
        </div>
        <div className="flex gap-2 items-center">
          <button className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined text-[#0d141b] dark:text-white">language</span>
          </button>
          <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 rounded-full p-1 pl-3 hover:shadow-md transition-shadow bg-white dark:bg-[#1A2633]">
            <span className="material-symbols-outlined text-[#0d141b] dark:text-white">menu</span>
            <div className="bg-gray-500 text-white rounded-full p-1 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] filled">account_circle</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ListingHeader;

