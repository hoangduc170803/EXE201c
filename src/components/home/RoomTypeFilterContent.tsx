import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface RoomTypeFilterProps {
  selectedTypes: string[];
  onApply: (types: string[]) => void;
}

interface PropertyTypeDisplay {
  value: string;
  label: string;
  icon: string;
}

const RoomTypeFilterContent: React.FC<RoomTypeFilterProps> = ({ selectedTypes, onApply }) => {
  const [selected, setSelected] = useState<string[]>(selectedTypes);
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  // Mapping để hiển thị tên tiếng Việt và icon cho từng loại
  const propertyTypeMapping: Record<string, { label: string; icon: string }> = {
    'APARTMENT': { label: 'Căn hộ', icon: 'apartment' },
    'STUDIO': { label: 'Studio', icon: 'home_work' },
    'HOUSE': { label: 'Nhà riêng', icon: 'home' },
    'VILLA': { label: 'Biệt thự', icon: 'villa' },
    'CONDO': { label: 'Chung cư', icon: 'location_city' },
    'TOWNHOUSE': { label: 'Nhà phố', icon: 'holiday_village' },
    'CABIN': { label: 'Cabin', icon: 'cabin' },
    'COTTAGE': { label: 'Nhà vườn', icon: 'cottage' },
    'LOFT': { label: 'Loft', icon: 'warehouse' },
    'PENTHOUSE': { label: 'Penthouse', icon: 'apartment' },
    'FARMHOUSE': { label: 'Nhà nông trại', icon: 'agriculture' },
    'OTHER': { label: 'Khác', icon: 'other_houses' },
  };

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const fetchPropertyTypes = async () => {
    try {
      const response = await api.getPropertyTypes();
      if (response.success && response.data) {
        // Map các loại property từ database với hiển thị tiếng Việt
        const types = response.data.map((type: string) => ({
          value: type,
          label: propertyTypeMapping[type]?.label || type,
          icon: propertyTypeMapping[type]?.icon || 'home',
        }));
        setPropertyTypes(types);
      }
    } catch (error) {
      console.error('Failed to fetch property types:', error);
      // Fallback to default types nếu API fail
      setPropertyTypes([
        { value: 'APARTMENT', label: 'Căn hộ', icon: 'apartment' },
        { value: 'STUDIO', label: 'Studio', icon: 'home_work' },
        { value: 'HOUSE', label: 'Nhà riêng', icon: 'home' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleType = (type: string) => {
    setSelected(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
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
      <div className="p-4 w-[280px]">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-[280px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Loại phòng</h3>
        {selected.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Xóa ({selected.length})
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto">
        {propertyTypes.map((type) => (
          <label
            key={type.value}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(type.value)}
              onChange={() => toggleType(type.value)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <span className="material-symbols-outlined !text-[20px] text-gray-600 dark:text-gray-400">
              {type.icon}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {type.label}
            </span>
          </label>
        ))}
      </div>

      {propertyTypes.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
          Không có loại phòng nào
        </div>
      )}

      <button
        onClick={handleApply}
        className="w-full mt-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Áp dụng{selected.length > 0 && ` (${selected.length})`}
      </button>
    </div>
  );
};

export default RoomTypeFilterContent;

