import React, { useState, useEffect } from 'react';
import { api, CategoryDto } from '@/services/api';

interface CategoriesProps {
  onCategoryChange: (categoryId: number | null) => void;
  activeCategoryId: number | null;
}

const Categories: React.FC<CategoriesProps> = ({ onCategoryChange, activeCategoryId }) => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then(response => {
      if (response.success) {
        setCategories(response.data);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    // Toggle category - if already selected, deselect
    if (activeCategoryId === categoryId) {
      onCategoryChange(null);
    } else {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="sticky top-[72px] z-40 bg-background-light dark:bg-background-dark border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2 mask-linear-fade flex-1">
            {loading ? (
              // Loading skeleton
              [...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[64px]">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex flex-col items-center gap-2 min-w-[64px] group cursor-pointer border-b-2 pb-2 transition-all duration-200 ${
                    activeCategoryId === category.id
                      ? 'text-[#0d141b] dark:text-white border-[#0d141b] dark:border-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-[#0d141b] dark:hover:text-white border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className={`material-symbols-outlined !text-[24px] ${activeCategoryId === category.id ? 'filled' : ''}`}>
                    {category.icon}
                  </span>
                  <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                </button>
              ))
            )}
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

