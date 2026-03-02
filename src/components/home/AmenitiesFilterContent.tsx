import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface AmenitiesFilterProps {
  selectedAmenities: number[];
  onApply: (amenities: number[]) => void;
}

interface Amenity {
  id: number;
  name: string;
  icon?: string;
  category: string;
}

const AmenitiesFilterContent: React.FC<AmenitiesFilterProps> = ({ selectedAmenities, onApply }) => {
  const [selected, setSelected] = useState<number[]>(selectedAmenities);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  // Common amenities for long-term rentals


  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await api.getAmenities();
      if (response.success && response.data) {
        // Filter to show most relevant amenities for long-term rentals
        setAmenities(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApply(selected);
  };

  const handleClear = () => {
    setSelected([]);
  };

  if (loading) {
    return (
      <div className="p-4 w-[320px]">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-[320px] max-h-[400px] overflow-y-auto">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white dark:bg-gray-800 pb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">Tiện ích</h3>
        {selected.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Xóa ({selected.length})
          </button>
        )}
      </div>

      <div className="space-y-2">
        {amenities.map((amenity) => (
          <label
            key={amenity.id}
            className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(amenity.id)}
              onChange={() => toggleAmenity(amenity.id)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            {amenity.icon && (
              <span className="material-symbols-outlined !text-[18px] text-gray-600 dark:text-gray-400">
                {amenity.icon}
              </span>
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
              {amenity.name}
            </span>
          </label>
        ))}
      </div>

      {amenities.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          Không có tiện ích nào
        </div>
      )}

      <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleApply}
          className="w-full py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Áp dụng{selected.length > 0 && ` (${selected.length})`}
        </button>
      </div>
    </div>
  );
};

export default AmenitiesFilterContent;

