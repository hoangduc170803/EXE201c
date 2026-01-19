import React from 'react';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import ListingCard from '@/components/home/ListingCard';
import MapWidget from '@/components/home/MapWidget';
import { LISTINGS } from '@/constants';

const HomePage: React.FC = () => {
  return (
    <div className="page-transition">
      <Hero />
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
              <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">
                Top-rated stays near you
              </h2>
              <a className="text-primary text-sm font-semibold hover:underline flex items-center gap-1" href="#">
                View all
                <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
              </a>
            </div>

            {/* Property Grid - Responsive như cũ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
              {LISTINGS.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-12 mb-8">
              <button className="px-8 py-3 rounded-lg border border-[#0d141b] dark:border-white text-[#0d141b] dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Show more
              </button>
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
