import React, { useRef, useEffect } from 'react';
import type { FilterDropdownProps } from '@/types';

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  isOpen,
  onToggle,
  onClose,
  children,
  hasActiveFilters
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`px-4 py-2 bg-white dark:bg-gray-800 border rounded-full text-sm font-medium transition-colors flex items-center gap-2 shadow-sm ${
          hasActiveFilters 
            ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-700' 
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
        }`}
      >
        <span>{label}</span>
        <span className="material-symbols-outlined !text-[18px]">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 min-w-[320px] p-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;

