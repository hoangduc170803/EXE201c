import React, { useState } from 'react';

interface TypeFilterProps {
  propertyType?: 'ENTIRE_PLACE' | 'PRIVATE_ROOM' | 'SHARED_ROOM';
  onApply: (type?: 'ENTIRE_PLACE' | 'PRIVATE_ROOM' | 'SHARED_ROOM') => void;
}

const TypeFilterContent: React.FC<TypeFilterProps> = ({ propertyType, onApply }) => {
  const [selected, setSelected] = useState(propertyType);

  const options = [
    {
      value: 'ENTIRE_PLACE',
      label: 'Entire place',
      description: 'Have the whole place to yourself'
    },
    {
      value: 'PRIVATE_ROOM',
      label: 'Private room',
      description: 'Have your own room and share some common spaces'
    },
    {
      value: 'SHARED_ROOM',
      label: 'Shared room',
      description: 'Stay in a shared space, like a common room'
    }
  ] as const;

  const handleApply = () => {
    onApply(selected);
  };

  const handleClear = () => {
    setSelected(undefined);
    onApply(undefined);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-base mb-3">Type of place</h3>

      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selected === option.value 
                ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-700' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <input
              type="radio"
              name="propertyType"
              value={option.value}
              checked={selected === option.value}
              onChange={(e) => setSelected(e.target.value as typeof option.value)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {option.description}
              </div>
            </div>
          </label>
        ))}
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

export default TypeFilterContent;

