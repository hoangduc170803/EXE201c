import React, { useState } from 'react';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import ListingCard from '@/components/home/ListingCard';
import MapWidget from '@/components/home/MapWidget';
import { useProperties } from '@/hooks/useProperties';
import { LISTINGS } from '@/constants';

const HomePage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const { listings, loading, error, hasMore, loadMore, search } = useProperties(12);

  // Use API data if available, otherwise fallback to static data
  const displayListings = listings.length > 0 ? listings : (loading ? [] : LISTINGS);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    search(keyword);
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    search('');
  };

  return (
    <div className="page-transition">
      <Hero onSearch={handleSearch} initialKeyword={searchKeyword} />
      <Categories />
      
      {/* Content Area */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="flex-1 min-w-0">
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:border-gray-400 transition-colors flex items-center gap-2 shadow-sm">
                <span>Price</span>
                <span className="material-symbols-outlined !text-[18px]">expand_more</span>
              </button>
              <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:border-gray-400 transition-colors flex items-center gap-2 shadow-sm">
                <span>Type of place</span>
                <span className="material-symbols-outlined !text-[18px]">expand_more</span>
              </button>
              <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:border-gray-400 transition-colors flex items-center gap-2 shadow-sm">
                <span>Free cancellation</span>
              </button>
              <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:border-gray-400 transition-colors flex items-center gap-2 shadow-sm">
                <span>Wifi</span>
              </button>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">
                  {searchKeyword ? `Search results for "${searchKeyword}"` : 'Top-rated stays near you'}
                </h2>
                {searchKeyword && (
                  <p className="text-sm text-gray-500 mt-1">
                    Found {listings.length} properties
                    <button 
                      onClick={handleClearSearch}
                      className="ml-2 text-primary hover:underline"
                    >
                      Clear search
                    </button>
                  </p>
                )}
              </div>
              {!searchKeyword && (
                <a className="text-primary text-sm font-semibold hover:underline flex items-center gap-1" href="#">
                  View all
                  <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                </a>
              )}
            </div>

            {/* Loading State */}
            {loading && listings.length === 0 && (
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
            {!loading && searchKeyword && listings.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  We couldn't find any properties matching "{searchKeyword}"
                </p>
                <button 
                  onClick={handleClearSearch}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Error State */}
            {error && !loading && listings.length === 0 && (
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
            {(!loading || listings.length > 0) && displayListings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
                {displayListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="flex justify-center mt-12 mb-8">
              {hasMore ? (
                <button 
                  onClick={loadMore}
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
              ) : displayListings.length > 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  You've seen all available properties
                </p>
              ) : null}
            </div>
          </div>

          {/* Right Column - Map (Sticky, chỉ hiện trên màn hình lớn) */}
          <div className="hidden xl:block xl:w-[400px] 2xl:w-[500px] shrink-0">
            <MapWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
