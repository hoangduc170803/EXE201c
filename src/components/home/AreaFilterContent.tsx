import React, { useState } from 'react';

interface AreaFilterProps {
  minArea?: number;
  maxArea?: number;
  onApply: (min: number | undefined, max: number | undefined) => void;
}

const AreaFilterContent: React.FC<AreaFilterProps> = ({ minArea, maxArea, onApply }) => {
  const [min, setMin] = useState<string>(minArea?.toString() || '');
  const [max, setMax] = useState<string>(maxArea?.toString() || '');

  const presets = [
    { label: 'Nhỏ (< 20m²)', min: 0, max: 20 },
    { label: 'Trung bình (20-30m²)', min: 20, max: 30 },
    { label: 'Rộng (30-50m²)', min: 30, max: 50 },
    { label: 'Rất rộng (> 50m²)', min: 50, max: undefined },
  ];

  const handlePresetClick = (preset: { min: number; max: number | undefined }) => {
    setMin(preset.min.toString());
    setMax(preset.max?.toString() || '');
  };

  const handleApply = () => {
    const minValue = min ? parseInt(min) : undefined;
    const maxValue = max ? parseInt(max) : undefined;
    onApply(minValue, maxValue);
  };

  const handleClear = () => {
    setMin('');
    setMax('');
  };

  return (
    <div className="p-4 w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Diện tích</h3>
        {(min || max) && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Xóa
          </button>
        )}
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset)}
            className="px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Range */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Diện tích tối thiểu
          </label>
          <div className="relative">
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="Từ"
              className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <span className="absolute right-3 top-2.5 text-sm text-gray-500">m²</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Diện tích tối đa
          </label>
          <div className="relative">
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="Đến"
              className="w-full px-3 py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <span className="absolute right-3 top-2.5 text-sm text-gray-500">m²</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleApply}
        className="w-full mt-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Áp dụng
      </button>
    </div>
  );
};

export default AreaFilterContent;

