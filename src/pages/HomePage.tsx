import React, { useState, useEffect, useCallback } from 'react';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import ListingCard from '@/components/home/ListingCard';
import MapWidget from '@/components/home/MapWidgetReal';
import FilterDropdown from '@/components/home/FilterDropdown';
import PriceFilterContent from '@/components/home/PriceFilterContent';
import TypeFilterContent from '@/components/home/TypeFilterContent';
import AmenityFilterContent from '@/components/home/AmenityFilterContent';
import { useProperties } from '@/hooks/useProperties';
import { LISTINGS } from '@/constants';
import { api } from '@/services/api';
import type { PropertyFilter, SearchCriteria, Listing } from '@/types';

const HomePage: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [filters, setFilters] = useState<PropertyFilter>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  const { listings, loading: hookLoading, error } = useProperties(12);

  // Apply filters whenever they change
  const applyFilters = useCallback(async (filterObj: PropertyFilter, page = 0) => {
    setLoading(true);
    try {
      const response = await api.filterProperties(filterObj, page, 12);
      if (response.success) {
        const newListings = response.data.content.map((p: any) => ({
          id: String(p.id),
          image: p.primaryImageUrl || p.images?.[0]?.imageUrl || '',
          location: `${p.city}, ${p.country}`,
          details: `${p.propertyType} • ${p.bedrooms} bedrooms • ${p.maxGuests} guests`,
          dates: 'Available now',
          rating: p.averageRating || 0,
          price: p.pricePerNight,
          isGuestFavorite: p.isFeatured,
        }));

        if (page === 0) {
          setFilteredListings(newListings);
        } else {
          setFilteredListings(prev => [...prev, ...newListings]);
        }
        setHasMore(!response.data.last);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Build filter object from search criteria and filters
  const buildFilterObject = useCallback((): PropertyFilter => {
    const filterObj: PropertyFilter = { ...filters };

    if (searchCriteria) {
      if (searchCriteria.location) {
        filterObj.city = searchCriteria.location;
      }
      if (searchCriteria.checkIn) {
        filterObj.checkIn = searchCriteria.checkIn.toISOString().split('T')[0];
      }
      if (searchCriteria.checkOut) {
        filterObj.checkOut = searchCriteria.checkOut.toISOString().split('T')[0];
      }
      // Calculate total guests (adults + children, infants don't count toward max guests)
      const totalGuests = searchCriteria.guests.adults + searchCriteria.guests.children;
      if (totalGuests > 1) {
        filterObj.minGuests = totalGuests;
      }
    }

    return filterObj;
  }, [filters, searchCriteria]);

  // Initial load or when filters/search change
  useEffect(() => {
    const hasFilters = Object.keys(filters).length > 0;
    const hasSearch = searchCriteria && (searchCriteria.location || searchCriteria.checkIn || searchCriteria.checkOut);

    if (hasFilters || hasSearch) {
      const filterObj = buildFilterObject();
      applyFilters(filterObj, 0);
    } else {
      // No filters, use default listings
      setFilteredListings([]);
    }
  }, [filters, searchCriteria, buildFilterObject, applyFilters]);

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

  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
  };

  const handleClearSearch = () => {
    setSearchCriteria(null);
    setFilters({});
  };

  const handleLoadMore = () => {
    const filterObj = buildFilterObject();
    applyFilters(filterObj, currentPage + 1);
  };

  const handleMarkerClick = (listingId: string) => {
    setActiveListingId(listingId);
    // Scroll to listing card
    const element = document.getElementById(`listing-${listingId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Use filtered listings if available, otherwise fallback
  const displayListings = filteredListings.length > 0
    ? filteredListings
    : (listings.length > 0 ? listings : (hookLoading ? [] : LISTINGS));

  const isFiltering = Object.keys(filters).length > 0 || (searchCriteria && (searchCriteria.location || searchCriteria.checkIn || searchCriteria.checkOut));
  const hasActiveFilters = (key: string) => {
    switch (key) {
      case 'price': return !!(filters.minPrice || filters.maxPrice);
      case 'type': return !!filters.propertyType;
      case 'amenities': return !!(filters.amenityIds && filters.amenityIds.length > 0);
      default: return false;
    }
  };

  // Format search summary
  const getSearchSummary = () => {
    const parts: string[] = [];

    if (searchCriteria?.location) {
      parts.push(searchCriteria.location);
    }
    if (searchCriteria?.checkIn && searchCriteria?.checkOut) {
      const checkInStr = searchCriteria.checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const checkOutStr = searchCriteria.checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      parts.push(`${checkInStr} - ${checkOutStr}`);
    }
    const totalGuests = (searchCriteria?.guests.adults || 0) + (searchCriteria?.guests.children || 0);
    if (totalGuests > 1) {
      parts.push(`${totalGuests} guests`);
    }

    return parts.length > 0 ? parts.join(' • ') : '';
  };

  return (
    <div className="page-transition">
      <Hero onSearch={handleSearch} initialKeyword={searchCriteria?.location || ''} />
      <Categories
        onCategoryChange={(catId) => handleFilterChange({ categoryId: catId || undefined })}
        activeCategoryId={filters.categoryId || null}
      />

      {/* Content Area */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1 min-w-0">
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-3 mb-8">
              <FilterDropdown
                label="Price"
                isOpen={openDropdown === 'price'}
                onToggle={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                onClose={() => setOpenDropdown(null)}
                hasActiveFilters={hasActiveFilters('price')}
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
                label="Type of place"
                isOpen={openDropdown === 'type'}
                onToggle={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                onClose={() => setOpenDropdown(null)}
                hasActiveFilters={hasActiveFilters('type')}
              >
                <TypeFilterContent
                  propertyType={filters.propertyType}
                  onApply={(type) => {
                    handleFilterChange({ propertyType: type });
                    setOpenDropdown(null);
                  }}
                />
              </FilterDropdown>

              <FilterDropdown
                label="Amenities"
                isOpen={openDropdown === 'amenities'}
                onToggle={() => setOpenDropdown(openDropdown === 'amenities' ? null : 'amenities')}
                onClose={() => setOpenDropdown(null)}
                hasActiveFilters={hasActiveFilters('amenities')}
              >
                <AmenityFilterContent
                  selectedAmenityIds={filters.amenityIds}
                  onApply={(amenityIds) => {
                    handleFilterChange({ amenityIds });
                    setOpenDropdown(null);
                  }}
                />
              </FilterDropdown>

              <button
                onClick={() => handleFilterChange({ isInstantBook: !filters.isInstantBook })}
                className={`px-4 py-2 bg-white dark:bg-gray-800 border rounded-full text-sm font-medium transition-colors flex items-center gap-2 shadow-sm ${
                  filters.isInstantBook 
                    ? 'border-black dark:border-white bg-gray-100 dark:bg-gray-700' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                }`}
              >
                <span>Instant Book</span>
              </button>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">
                  {isFiltering ? 'Search results' : 'Top-rated stays near you'}
                </h2>
                {isFiltering && (
                  <div className="mt-1">
                    {getSearchSummary() && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {getSearchSummary()}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Found {displayListings.length} properties
                      <button
                        onClick={handleClearSearch}
                        className="ml-2 text-primary hover:underline"
                      >
                        Clear all filters
                      </button>
                    </p>
                  </div>
                )}
              </div>
              {!isFiltering && (
                <a className="text-primary text-sm font-semibold hover:underline flex items-center gap-1" href="#">
                  View all
                  <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                </a>
              )}
            </div>

            {/* Loading State */}
            {loading && displayListings.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                ))}
              </div>
            )}

            {/* No Results State */}
            {!loading && isFiltering && displayListings.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your filters to find more results
                </p>
                <button 
                  onClick={handleClearSearch}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Error State */}
            {error && !loading && displayListings.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">cloud_off</span>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Unable to load properties from server.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Showing cached data instead.
                </p>
              </div>
            )}

            {/* Property Grid */}
            {(!loading || displayListings.length > 0) && displayListings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
                {displayListings.map((listing) => (
                  <div
                    key={listing.id}
                    id={`listing-${listing.id}`}
                    className={`transition-all duration-300 ${activeListingId === listing.id ? 'ring-2 ring-primary ring-offset-2 rounded-xl' : ''}`}
                    onMouseEnter={() => setActiveListingId(listing.id)}
                    onMouseLeave={() => setActiveListingId(null)}
                  >
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="flex justify-center mt-12 mb-8">
              {hasMore && isFiltering ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 rounded-lg border border-[#0d141b] dark:border-white text-[#0d141b] dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    'Show more'
                  )}
                </button>
              ) : displayListings.length > 0 && isFiltering ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  You've seen all available properties
                </p>
              ) : null}
            </div>
          </div>

          {/* Right Column - Map (Sticky, chỉ hiện trên màn hình lớn) */}
          <div className="hidden xl:block xl:w-[450px] 2xl:w-[550px] shrink-0">
            <div className="sticky top-[140px] h-[calc(100vh-160px)]">
              <MapWidget
                listings={displayListings}
                onMarkerClick={handleMarkerClick}
                activeListingId={activeListingId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
