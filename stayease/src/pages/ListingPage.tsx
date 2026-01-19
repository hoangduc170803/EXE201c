import React from 'react';
import ListingHeader from '@/components/listing/ListingHeader';
import ListingTitle from '@/components/listing/ListingTitle';
import HeroGallery from '@/components/listing/HeroGallery';
import ListingInfo from '@/components/listing/ListingInfo';
import BookingWidget from '@/components/listing/BookingWidget';
import ReviewsSection from '@/components/listing/ReviewsSection';
import HostProfile from '@/components/listing/HostProfile';
import ListingFooter from '@/components/listing/ListingFooter';

const ListingPage: React.FC = () => {
  return (
    <div className="page-transition">
      <ListingHeader />
      <main className="layout-container flex flex-col items-center py-6 md:py-10 px-4 md:px-10 lg:px-20">
        <div className="layout-content-container flex flex-col max-w-[1280px] w-full flex-1">
          <ListingTitle />
          <HeroGallery />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            <ListingInfo />
            <BookingWidget />
          </div>

          <ReviewsSection />

          {/* Map Section */}
          <div className="py-8 border-t border-gray-200 dark:border-gray-700" id="location">
            <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white mb-2">
              Where you'll be
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Da Nang, Vietnam</p>
            <div className="w-full h-[480px] rounded-xl overflow-hidden bg-gray-100 relative group">
              <div
                className="w-full h-full bg-cover bg-center filter saturate-50 group-hover:saturate-100 transition-all duration-700"
                style={{
                  backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGFM_1A69Cr62FsPNFIxJWtK4o5yOV6SbmQwwcjnNU1c_gbboz0zmbZJQs43pfHUIFFcbVaV38nr7TtpAV41Jw_u5l9QZ5X_T2dZ3ARhUEhtB_mV5nWMZpHiEW0_79lA9PhlnUlBS8U0FxTzJxJBPlGJ7sC-VGFNskMRNFQRd4QiwD0-la-A_kq--Z67YRicrDIwVEXP7mUN_8oxBTyrn0ykbGopx0WWWEZWIjJqfEagyk0nkXzB3uEJtygZBG6J-Dyyb2WhA8DF4')",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-primary text-white p-3 rounded-full shadow-xl transform -translate-y-8 animate-bounce">
                  <span className="material-symbols-outlined filled text-3xl">home_pin</span>
                </div>
              </div>
            </div>
          </div>

          <HostProfile />
        </div>
      </main>
      <ListingFooter />
    </div>
  );
};

export default ListingPage;

