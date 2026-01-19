import React, { useState } from 'react';
import { CATEGORIES } from '@/constants';

const Categories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('beachfront');

  return (
    <div className="sticky top-[72px] z-40 bg-background-light dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2 mask-linear-fade flex-1">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center gap-2 min-w-[64px] group cursor-pointer border-b-2 pb-2 transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'text-[#0d141b] dark:text-white border-[#0d141b] dark:border-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#0d141b] dark:hover:text-white border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                }`}
              >
                <span className={`material-symbols-outlined !text-[24px] ${activeCategory === category.id ? 'filled' : ''}`}>
                  {category.icon}
                </span>
                <span className="text-xs font-medium whitespace-nowrap">{category.label}</span>
              </button>
            ))}
          </div>
          <button className="hidden md:flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 hover:border-black dark:hover:border-white transition-colors bg-white dark:bg-gray-800 shrink-0 text-[#0d141b] dark:text-white">
            <span className="material-symbols-outlined !text-[20px]">tune</span>
            <span className="text-sm font-semibold">Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;

