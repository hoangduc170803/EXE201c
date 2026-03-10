import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import ListingCard from '@/components/home/ListingCard';
import { api } from '@/services/api';
import type { SearchCriteria, Listing } from '@/types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [hotLongTermProperties, setHotLongTermProperties] = useState<Listing[]>([]);
  const [hotShortTermProperties, setHotShortTermProperties] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch hot/featured properties on mount
  useEffect(() => {
    const fetchHotProperties = async () => {
      setLoading(true);
      try {
        // Try to fetch featured properties first
        let response = await api.getFeaturedProperties(16);

        // Fallback: If no featured properties, fetch all properties
        if (!response.success || !response.data || response.data.length === 0) {
          console.log('No featured properties, fetching all properties...');
          const allPropertiesResponse = await api.filterProperties({}, 0, 16);
          if (allPropertiesResponse.success && allPropertiesResponse.data) {
              response = {
                  timestamp: Date.now().toString(),
                  success: true,
              data: allPropertiesResponse.data.content,
              message: 'Properties loaded'
            };
          }
        }

        if (response.success && response.data) {
          const allProperties = response.data.map((p: any) => ({
            id: String(p.id),
            image: p.primaryImageUrl || p.images?.[0]?.imageUrl || '',
            location: `${p.city}, ${p.country}`,
            details: `${p.propertyType} • ${p.bedrooms} bedrooms • ${p.maxGuests} guests`,
            dates: 'Available now',
            rating: p.averageRating || 0,
            price: p.pricePerNight,
            rentalType: p.rentalType || 'SHORT_TERM', // Default to SHORT_TERM if not set
            pricePerMonth: p.pricePerMonth || 0,
            isGuestFavorite: p.isFeatured,
          }));

          console.log('Total properties loaded:', allProperties.length);
          console.log('Properties by type:', {
            longTerm: allProperties.filter((p: Listing) => p.rentalType === 'LONG_TERM').length,
            shortTerm: allProperties.filter((p: Listing) => p.rentalType === 'SHORT_TERM').length
          });

          // Split by rental type
          const longTerm = allProperties.filter((p: Listing) => p.rentalType === 'LONG_TERM').slice(0, 8);
          const shortTerm = allProperties.filter((p: Listing) => p.rentalType === 'SHORT_TERM' || !p.rentalType).slice(0, 4);

          setHotLongTermProperties(longTerm);
          setHotShortTermProperties(shortTerm);

          console.log('Hot properties set:', {
            longTerm: longTerm.length,
            shortTerm: shortTerm.length
          });
        }
      } catch (error) {
        console.error('Failed to fetch hot properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotProperties();
  }, []);

  const handleSearch = (criteria: SearchCriteria) => {
    // Navigate to dedicated listing page based on rental mode
    if (criteria.rentalMode === 'long-term') {
      // Navigate to long-term listings page with search params
      const params = new URLSearchParams();
      if (criteria.location) params.append('location', criteria.location);
      if (criteria.priceRange?.min) params.append('minPrice', criteria.priceRange.min.toString());
      if (criteria.priceRange?.max) params.append('maxPrice', criteria.priceRange.max.toString());
      if (criteria.roomType) params.append('roomType', criteria.roomType);

      navigate(`/long-term-listings?${params.toString()}`);
    } else if (criteria.rentalMode === 'short-term') {
      // Navigate to short-term listings page with search params
      const params = new URLSearchParams();
      if (criteria.location) params.append('location', criteria.location);
      if (criteria.checkIn) {
        // Format date as YYYY-MM-DD for API
        const year = criteria.checkIn.getFullYear();
        const month = String(criteria.checkIn.getMonth() + 1).padStart(2, '0');
        const day = String(criteria.checkIn.getDate()).padStart(2, '0');
        params.append('checkIn', `${year}-${month}-${day}`);
      }
      if (criteria.checkOut) {
        // Format date as YYYY-MM-DD for API
        const year = criteria.checkOut.getFullYear();
        const month = String(criteria.checkOut.getMonth() + 1).padStart(2, '0');
        const day = String(criteria.checkOut.getDate()).padStart(2, '0');
        params.append('checkOut', `${year}-${month}-${day}`);
      }
      if (criteria.guests) {
        params.append('adults', criteria.guests.adults.toString());
        params.append('children', criteria.guests.children.toString());
      }

      navigate(`/short-term-listings?${params.toString()}`);
    }
  };

  return (
    <div className="page-transition">
      <Hero onSearch={handleSearch} defaultMode="long-term" />

      {/* Hot Properties Sections */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-12">
        {/* Long-term Hot Properties */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#0d141b] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined !text-[32px] text-red-500 filled">local_fire_department</span>
                Phòng trọ HOT tháng này
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Những phòng trọ được yêu thích nhất
              </p>
            </div>
            <button
              onClick={() => navigate('/long-term-listings')}
              className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Xem tất cả
              <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`skeleton-long-${i}`} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : hotLongTermProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {hotLongTermProperties.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">home</span>
              <p className="text-gray-500 dark:text-gray-400">Chưa có phòng trọ nổi bật</p>
            </div>
          )}
        </section>

        {/* Short-term Hot Properties */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#0d141b] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined !text-[32px] text-yellow-500 filled">star</span>
                Căn hộ nổi bật
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Điểm đến hoàn hảo cho kỳ nghỉ
              </p>
            </div>
            <button
              onClick={() => navigate('/short-term-listings')}
              className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Xem tất cả
              <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`skeleton-short-${i}`} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : hotShortTermProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {hotShortTermProperties.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">apartment</span>
              <p className="text-gray-500 dark:text-gray-400">Chưa có căn hộ nổi bật</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

