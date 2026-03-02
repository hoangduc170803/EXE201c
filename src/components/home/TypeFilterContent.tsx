import React, { useState } from 'react';

interface TypeFilterProps {
  selectedTypes: string[];
  onApply: (types: string[]) => void;
}

const TypeFilterContent: React.FC<TypeFilterProps> = ({ selectedTypes, onApply }) => {
  const [selected, setSelected] = useState<string[]>(selectedTypes);

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

  const toggleType = (value: string) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    onApply(selected);
  };

  const handleClear = () => {
    setSelected([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base">Type of place</h3>
        {selected.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear ({selected.length})
          </button>
        )}
      </div>

      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selected.includes(option.value)
                ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-700' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => toggleType(option.value)}
              className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary"
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

      <button
        onClick={handleApply}
        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
      >
        Apply{selected.length > 0 && ` (${selected.length})`}
      </button>
    </div>
  );
};

export default TypeFilterContent;

