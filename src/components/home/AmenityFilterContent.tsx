import React, { useState, useEffect } from 'react';
import { api, AmenityDto } from '@/services/api';

interface AmenityFilterProps {
  selectedAmenityIds?: number[];
  onApply: (amenityIds?: number[]) => void;
}

const AmenityFilterContent: React.FC<AmenityFilterProps> = ({ selectedAmenityIds = [], onApply }) => {
  const [amenities, setAmenities] = useState<AmenityDto[]>([]);
  const [selected, setSelected] = useState<number[]>(selectedAmenityIds);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAmenities().then(response => {
      if (response.success) {
        setAmenities(response.data);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const toggleAmenity = (id: number) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(amenityId => amenityId !== id)
        : [...prev, id]
    );
  };

  const handleApply = () => {
    onApply(selected.length > 0 ? selected : undefined);
  };

  const handleClear = () => {
    setSelected([]);
    onApply(undefined);
  };

  if (loading) {
    return (
      <div className="space-y-4 w-[320px]">
        <h3 className="font-semibold text-base">Amenities</h3>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-[320px] max-h-[400px] overflow-y-auto">
      <h3 className="font-semibold text-base sticky top-0 bg-white dark:bg-gray-800 pb-2">Amenities</h3>

      <div className="space-y-2">
        {amenities.map((amenity) => (
          <label
            key={amenity.id}
            className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
              selected.includes(amenity.id) 
                ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-700' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(amenity.id)}
              onChange={() => toggleAmenity(amenity.id)}
              className="w-4 h-4"
            />
            <span className="material-symbols-outlined !text-[20px] text-gray-600 dark:text-gray-400">
              {amenity.icon || 'check_circle'}
            </span>
            <span className="flex-1 text-sm font-medium">{amenity.name}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-2 pt-2 sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
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
          Apply {selected.length > 0 && `(${selected.length})`}
        </button>
      </div>
    </div>
  );
};

export default AmenityFilterContent;

