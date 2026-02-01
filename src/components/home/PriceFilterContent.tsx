import React, { useState } from 'react';

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onApply: (min?: number, max?: number) => void;
}

const PriceFilterContent: React.FC<PriceFilterProps> = ({ minPrice, maxPrice, onApply }) => {
  const [min, setMin] = useState(minPrice?.toString() || '');
  const [max, setMax] = useState(maxPrice?.toString() || '');

  const handleApply = () => {
    onApply(
      min ? parseFloat(min) : undefined,
      max ? parseFloat(max) : undefined
    );
  };

  const handleClear = () => {
    setMin('');
    setMax('');
    onApply(undefined, undefined);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-base mb-2">Price per night</h3>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Min price</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="$0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="text-gray-400 pt-5">-</div>

        <div className="flex-1">
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Max price</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="$1000+"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleClear}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PriceFilterContent;

