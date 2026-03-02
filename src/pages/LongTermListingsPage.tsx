import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '@/components/home/ListingCard';
import FilterDropdown from '@/components/home/FilterDropdown';
import PriceFilterContent from '@/components/home/PriceFilterContent';
import RoomTypeFilterContent from '@/components/home/RoomTypeFilterContent';
import AmenitiesFilterContent from '@/components/home/AmenitiesFilterContent';
import AreaFilterContent from '@/components/home/AreaFilterContent';
import { api } from '@/services/api';
import type { PropertyFilter, Listing } from '@/types';

const LongTermListingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Initialize filters from URL params
  useEffect(() => {
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    // const roomType = searchParams.get('roomType');

    const initialFilters: PropertyFilter = {};
    if (location) initialFilters.city = location;
    if (minPrice) initialFilters.minPrice = Number(minPrice);
    if (maxPrice) initialFilters.maxPrice = Number(maxPrice);
    // Note: roomType mapping would be handled differently in production

    setFilters(initialFilters);
  }, [searchParams]);

  // Fetch properties whenever filters change
  const fetchProperties = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      // Use dedicated long-term API endpoint
      const response = await api.getLongTermProperties(page, 12, {
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        city: filters.city,
        categoryId: filters.categoryId,
        propertyTypes: filters.propertyTypes,
        amenityIds: filters.amenityIds,
        minArea: filters.minArea,
        maxArea: filters.maxArea,
      });

      console.log('LongTermListingsPage: API response', {
        success: response.success,
        dataLength: response.data?.content?.length || 0,
        filters: {
          propertyTypes: filters.propertyTypes,
          amenityIds: filters.amenityIds,
          minArea: filters.minArea,
          maxArea: filters.maxArea,
        },
      });

      if (response.success && response.data) {
        const newListings = response.data.content.map((p: any) => ({
          id: String(p.id),
          image: p.primaryImageUrl || p.images?.[0]?.imageUrl || '',
          location: `${p.city}, ${p.country}`,
          details: `${p.propertyType} • ${p.bedrooms} bedrooms`,
          dates: 'Available now',
          rating: p.averageRating || 0,
          price: p.pricePerNight,
          rentalType: p.rentalType,
          pricePerMonth: p.pricePerMonth,
          isGuestFavorite: p.isFeatured,
        }));

        console.log('LongTermListingsPage: Properties loaded', {
          count: newListings.length
        });

        if (page === 0) {
          setProperties(newListings);
        } else {
          setProperties(prev => [...prev, ...newListings]);
        }

        setHasMore(!response.data.last);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('LongTermListingsPage: Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties(0);
  }, [fetchProperties]);

  const handleFilterChange = (newFilters: Partial<PropertyFilter>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      // Remove undefined values
      Object.keys(updated).forEach(key => {
        if (updated[key as keyof PropertyFilter] === undefined) {
          delete updated[key as keyof PropertyFilter];
        }
      });
      return updated;
    });
  };

  const handleLoadMore = () => {
    fetchProperties(currentPage + 1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setActiveCategory(null);
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).length > 0 || activeCategory !== null;
  };

  return (
    <div className="page-transition min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0d141b] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined !text-[32px] text-primary">home</span>
                Phòng trọ dài hạn
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {properties.length} phòng trọ có sẵn
              </p>
            </div>
            {hasActiveFilters() && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary hover:underline"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>


        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Column - Filters & Properties */}
          <div className="flex-1 min-w-0">
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-3 mb-8">
              <FilterDropdown
                label="Mức giá"
                isOpen={openDropdown === 'price'}
                onToggle={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                onClose={() => setOpenDropdown(null)}
                hasActiveFilters={!!(filters.minPrice || filters.maxPrice)}
              >
                <PriceFilterContent
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onApply={(min, max) => {
                    handleFilterChange({ minPrice: min, maxPrice: max });
                    setOpenDropdown(null);
                  }}
                />
              </FilterDropdown>

              <FilterDropdown
                label="Loại phòng"
                isOpen={openDropdown === 'roomType'}
                onToggle={() => setOpenDropdown(openDropdown === 'roomType' ? null : 'roomType')}
                onClose={() => setOpenDropdown(null)}
                hasActiveFilters={!!(filters.propertyTypes && filters.propertyTypes.length > 0)}
              >
                <RoomTypeFilterContent
                  selectedTypes={filters.propertyTypes || []}
                  onApply={(types) => {
                    handleFilterChange({ propertyTypes: types.length > 0 ? types : undefined });
                    setOpenDropdown(null);
                  }}
                />
              </FilterDropdown>

              <FilterDropdown
                label="Tiện ích"
                isOpen={openDropdown === 'amenities'}
                onToggle={() => setOpenDropdown(openDropdown === 'amenities' ? null : 'amenities')}
                onClose={() => setOpenDropdown(null)}
                hasActiveFilters={!!(filters.amenityIds && filters.amenityIds.length > 0)}
              >
                <AmenitiesFilterContent
                  selectedAmenities={filters.amenityIds || []}
                  onApply={(amenities) => {
                    handleFilterChange({ amenityIds: amenities.length > 0 ? amenities : undefined });
                    setOpenDropdown(null);
                  }}
                />
              </FilterDropdown>

              <FilterDropdown
                label="Diện tích"
                isOpen={openDropdown === 'area'}
                onToggle={() => setOpenDropdown(openDropdown === 'area' ? null : 'area')}
                onClose={() => setOpenDropdown(null)}
                hasActiveFilters={!!(filters.minArea || filters.maxArea)}
              >
                <AreaFilterContent
                  minArea={filters.minArea}
                  maxArea={filters.maxArea}
                  onApply={(min, max) => {
                    handleFilterChange({ minArea: min, maxArea: max });
                    setOpenDropdown(null);
                  }}
                />
              </FilterDropdown>
            </div>

            {/* Loading State */}
            {loading && properties.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && properties.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Không tìm thấy phòng trọ
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Thử điều chỉnh bộ lọc để xem thêm kết quả
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}

            {/* Property Grid */}
            {properties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {properties.map((listing) => (
                  <div
                    key={listing.id}
                    id={`listing-${listing.id}`}
                    className={`transition-all duration-300 ${
                      activeListingId === listing.id ? 'ring-2 ring-primary ring-offset-2 rounded-xl' : ''
                    }`}
                    onMouseEnter={() => setActiveListingId(listing.id)}
                    onMouseLeave={() => setActiveListingId(null)}
                  >
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && properties.length > 0 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 rounded-lg border border-[#0d141b] dark:border-white text-[#0d141b] dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang tải...' : 'Xem thêm'}
                </button>
              </div>
            )}
          </div>

          {/*/!* Right Column - Map *!/*/}
          {/*<div className="hidden xl:block xl:w-[450px] 2xl:w-[550px] shrink-0">*/}
          {/*  <div className="sticky top-[100px] h-[calc(100vh-120px)]">*/}
          {/*    <MapWidget*/}
          {/*      listings={properties}*/}
          {/*      onMarkerClick={(id) => {*/}
          {/*        setActiveListingId(id);*/}
          {/*        const element = document.getElementById(`listing-${id}`);*/}
          {/*        if (element) {*/}
          {/*          element.scrollIntoView({ behavior: 'smooth', block: 'center' });*/}
          {/*        }*/}
          {/*      }}*/}
          {/*      activeListingId={activeListingId}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

export default LongTermListingsPage;

