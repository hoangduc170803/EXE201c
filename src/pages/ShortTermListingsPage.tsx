import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '@/components/home/ListingCard';
import MapWidget from '@/components/home/MapWidgetReal';
import FilterDropdown from '@/components/home/FilterDropdown';
import PriceFilterContent from '@/components/home/PriceFilterContent';
import RoomTypeFilterContent from '@/components/home/RoomTypeFilterContent';
import AmenitiesFilterContent from '@/components/home/AmenitiesFilterContent';
import { api } from '@/services/api';
import type { PropertyFilter, Listing } from '@/types';

const ShortTermListingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  // Categories for short-term rentals
  const categories = [
    { id: 'villa', icon: 'villa', label: 'Villa' },
    { id: 'apartment', icon: 'apartment', label: 'Apartment' },
    { id: 'hotel', icon: 'hotel', label: 'Hotel' },
    { id: 'beach', icon: 'beach_access', label: 'Beachfront' },
    { id: 'mountain', icon: 'landscape', label: 'Mountain' },
    { id: 'city', icon: 'location_city', label: 'City Center' },
  ];

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Helper function to format date
  const formatDateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize filters from URL params
  useEffect(() => {
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');

    const initialFilters: PropertyFilter = {};
    if (location) initialFilters.city = location;
    if (checkIn) initialFilters.checkIn = formatDateToLocalString(new Date(checkIn));
    if (checkOut) initialFilters.checkOut = formatDateToLocalString(new Date(checkOut));

    const totalGuests = Number(adults || 0) + Number(children || 0);
    if (totalGuests > 1) initialFilters.minGuests = totalGuests;

    setFilters(initialFilters);
  }, [searchParams]);

  // Fetch properties whenever filters change
  const fetchProperties = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      // Use dedicated short-term API endpoint
      const response = await api.getShortTermProperties(page, 12, {
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        city: filters.city,
        propertyTypes: filters.propertyTypes, // Changed from propertyType to propertyTypes array
        amenityIds: filters.amenityIds,
        minGuests: filters.minGuests,
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
      });

      console.log('ShortTermListingsPage: API response', {
        success: response.success,
        dataLength: response.data?.content?.length || 0,
      });

      if (response.success && response.data) {
        const newListings = response.data.content.map((p: any) => ({
          id: String(p.id),
          image: p.primaryImageUrl || p.images?.[0]?.imageUrl || '',
          location: `${p.city}, ${p.country}`,
          details: `${p.propertyType} • ${p.bedrooms} bedrooms • ${p.maxGuests} guests`,
          dates: 'Available',
          rating: p.averageRating || 0,
          price: p.pricePerNight,
          rentalType: p.rentalType,
          pricePerMonth: p.pricePerMonth,
          isGuestFavorite: p.isFeatured,
        }));

        console.log('ShortTermListingsPage: Properties loaded', {
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
      console.error('ShortTermListingsPage: Failed to fetch properties:', error);
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

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
    // In real implementation, this would filter by category
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

  const hasActiveFilterType = (key: string) => {
    switch (key) {
      case 'price': return !!(filters.minPrice || filters.maxPrice);
      case 'type': return !!(filters.propertyTypes && filters.propertyTypes.length > 0);
      case 'amenities': return !!(filters.amenityIds && filters.amenityIds.length > 0);
      default: return false;
    }
  };

  return (
    <div className="page-transition min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0d141b] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined !text-[32px] text-primary">flight</span>
                Short-term Stays
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {properties.length} properties available
              </p>
            </div>
            {hasActiveFilters() && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400'
                }`}
              >
                <span className="material-symbols-outlined !text-[18px]">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
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
                label="Price"
                isOpen={openDropdown === 'price'}
                onToggle={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                onClose={() => setOpenDropdown(null)}
                hasActiveFilters={hasActiveFilterType('price')}
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
                isOpen={openDropdown === 'type'}
                onToggle={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                onClose={() => setOpenDropdown(null)}
                hasActiveFilters={hasActiveFilterType('type')}
              >
                <RoomTypeFilterContent
                  selectedTypes={filters.propertyTypes || []}
                  onApply={(types: string[]) => {
                    handleFilterChange({ propertyTypes: types.length > 0 ? types : undefined });
                    setOpenDropdown(null);
                  }}
                />
              </FilterDropdown>

              <FilterDropdown
                label="Amenities"
                isOpen={openDropdown === 'amenities'}
                onToggle={() => setOpenDropdown(openDropdown === 'amenities' ? null : 'amenities')}
                onClose={() => setOpenDropdown(null)}
                hasActiveFilters={hasActiveFilterType('amenities')}
              >
                <AmenitiesFilterContent
                  selectedAmenities={filters.amenityIds || []}
                  onApply={(amenityIds: number[]) => {
                    handleFilterChange({ amenityIds: amenityIds.length > 0 ? amenityIds : undefined });
                    setOpenDropdown(null);
                  }}
                />
              </FilterDropdown>

              <button
                onClick={() => handleFilterChange({ isInstantBook: !filters.isInstantBook })}
                className={`px-4 py-2 bg-white dark:bg-gray-800 border rounded-full text-sm font-medium transition-colors ${
                  filters.isInstantBook
                    ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                }`}
              >
                Instant Book
              </button>
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
                  No properties found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Property Grid */}
            {properties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                  {loading ? 'Loading...' : 'Show more'}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Map */}
          <div className="hidden xl:block xl:w-[450px] 2xl:w-[550px] shrink-0">
            <div className="sticky top-[100px] h-[calc(100vh-120px)]">
              <MapWidget
                listings={properties}
                onMarkerClick={(id) => {
                  setActiveListingId(id);
                  const element = document.getElementById(`listing-${id}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                activeListingId={activeListingId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortTermListingsPage;

