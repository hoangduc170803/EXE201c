import React from 'react';
import { PropertyDto } from '@/services/api';

interface ListingInfoProps {
  property: PropertyDto;
}

const ListingInfo: React.FC<ListingInfoProps> = ({ property }) => {
  return (
    <div className="lg:col-span-2 flex flex-col gap-8">
      {/* Host Info Header */}
      <div className="flex justify-between items-center py-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">
            {property.propertyType} hosted by {property.host.firstName} {property.host.lastName}
          </h2>
          <p className="text-[#4c739a] dark:text-gray-400 mt-1">
            {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.bathrooms} baths
          </p>
        </div>
        <div
          className="bg-cover bg-center rounded-full size-16 border border-gray-200"
          style={{
            backgroundImage: `url('${property.host.avatarUrl || 'https://via.placeholder.com/150'}')`,
          }}
        ></div>
      </div>

      {/* Highlights */}
      <div className="flex flex-col gap-6 py-2 border-b border-gray-200 dark:border-gray-700 pb-8">
        {property.host.isVerified && (
          <div className="flex gap-4 items-start">
            <span className="material-symbols-outlined text-2xl text-[#0d141b] dark:text-white mt-1">
              military_tech
            </span>
            <div>
              <h3 className="font-bold text-[#0d141b] dark:text-white">{property.host.firstName} is a Verified Host</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Verified hosts are experienced, highly rated hosts who are committed to providing great stays for guests.
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-4 items-start">
          <span className="material-symbols-outlined text-2xl text-[#0d141b] dark:text-white mt-1">
            location_on
          </span>
          <div>
            <h3 className="font-bold text-[#0d141b] dark:text-white">Great location</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Recent guests gave the location a 5-star rating.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <span className="material-symbols-outlined text-2xl text-[#0d141b] dark:text-white mt-1">
            calendar_month
          </span>
          <div>
            <h3 className="font-bold text-[#0d141b] dark:text-white">Free cancellation for 48 hours</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Get a full refund if you change your mind.
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="py-2 border-b border-gray-200 dark:border-gray-700 pb-8">
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          <p className="mb-4">
            {property.description}
          </p>
          <button className="font-bold underline text-[#0d141b] dark:text-white flex items-center gap-1 mt-2">
            Show more <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Amenities */}
      <div className="py-2 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-6">What this place offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {property.amenities.slice(0, 10).map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="material-symbols-outlined">{amenity.icon || 'check_circle'}</span>
              <span>{amenity.name}</span>
            </div>
          ))}
        </div>
        {property.amenities.length > 10 && (
          <button className="mt-8 px-6 py-3 border border-gray-800 dark:border-gray-200 rounded-lg font-semibold text-[#0d141b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Show all {property.amenities.length} amenities
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingInfo;

