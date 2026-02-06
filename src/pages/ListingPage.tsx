import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, PropertyDto } from '@/services/api';
import ListingHeader from '@/components/listing/ListingHeader';
import ListingTitle from '@/components/listing/ListingTitle';
import HeroGallery from '@/components/listing/HeroGallery';
import ListingInfo from '@/components/listing/ListingInfo';
import BookingWidget from '@/components/listing/BookingWidget';
import ReviewsSection from '@/components/listing/ReviewsSection';
import HostProfile from '@/components/listing/HostProfile';
import ListingFooter from '@/components/listing/ListingFooter';

const ListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!id) {
          throw new Error('Property ID is missing');
        }

        // Since api.getPropertyById expects a number, convert id
        // Ensure id is a number or handle error
        const propertyId = parseInt(id, 10);
        if (isNaN(propertyId)) {
          throw new Error('Invalid property ID');
        }

        const response = await api.getPropertyById(propertyId);
        if (response.success) {
          setProperty(response.data);
        } else {
          setError(response.message || 'Failed to load property');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred fetching the property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="text-gray-600">{error || 'Property not found'}</p>
        <a href="/" className="text-primary hover:underline">Go Home</a>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <ListingHeader />
      <main className="layout-container flex flex-col items-center py-6 md:py-10 px-4 md:px-10 lg:px-20">
        <div className="layout-content-container flex flex-col max-w-[1280px] w-full flex-1">
          <ListingTitle property={property} />
          <HeroGallery images={property.images} />

          {/* MainContent Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            <ListingInfo property={property} />
          <BookingWidget
            pricePerNight={property.pricePerNight}
            rating={property.averageRating}
            totalReviews={property.totalReviews}
            cleaningFee={property.cleaningFee}
            serviceFee={property.serviceFee}
            property={property}
          />
          </div>

          <ReviewsSection
            rating={property.averageRating}
            totalReviews={property.totalReviews}
          />

          {/* Map Section */}
          <div className="py-8 border-t border-gray-200 dark:border-gray-700" id="location">
            <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white mb-2">
              Where you'll be
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{property.city}, {property.country}</p>
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

          <HostProfile host={property.host} />
        </div>
      </main>
      <ListingFooter />
    </div>
  );
};

export default ListingPage;

