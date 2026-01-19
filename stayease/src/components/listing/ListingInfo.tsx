import React from 'react';

const ListingInfo: React.FC = () => {
  return (
    <div className="lg:col-span-2 flex flex-col gap-8">
      {/* Host Info Header */}
      <div className="flex justify-between items-center py-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">
            Entire villa hosted by Nguyen Van A
          </h2>
          <p className="text-[#4c739a] dark:text-gray-400 mt-1">
            8 guests · 4 bedrooms · 4 beds · 3.5 baths
          </p>
        </div>
        <div
          className="bg-cover bg-center rounded-full size-16 border border-gray-200"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCCb6dO7g6garEkGsN53VtezEFOXwqqEbAAAKg0QAbJBrIf0nzMhaRuKXVjkewiQlYY_deffCWEtA0LC-rFZonaRFMPMn2_pRzDXlMp8xosUQnyOPvzhnm8R9O1u5hcBsFOOJ4MuXzsbQ6vzEYG6TZYB70mT2imIr7lm_CjO2bf2Px5_rpkrQtbprqHaMmx3T3DyrOBKQ1DJhZbDWCI9Coo8dLoeFbcwBAa80oYYkaKEPo8OLzxqIUoUL6_CER_QCGf-6LNTvJcNqU')",
          }}
        ></div>
      </div>

      {/* Highlights */}
      <div className="flex flex-col gap-6 py-2 border-b border-gray-200 dark:border-gray-700 pb-8">
        <div className="flex gap-4 items-start">
          <span className="material-symbols-outlined text-2xl text-[#0d141b] dark:text-white mt-1">
            military_tech
          </span>
          <div>
            <h3 className="font-bold text-[#0d141b] dark:text-white">Nguyen Van A is a Superhost</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <span className="material-symbols-outlined text-2xl text-[#0d141b] dark:text-white mt-1">
            location_on
          </span>
          <div>
            <h3 className="font-bold text-[#0d141b] dark:text-white">Great location</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              95% of recent guests gave the location a 5-star rating.
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
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="mb-4">
            Escape to our stunning luxury villa perched on the hills of Da Nang, offering breathtaking
            panoramic views of the ocean. This architectural masterpiece features floor-to-ceiling windows,
            ensuring you never miss a sunrise.
          </p>
          <p className="mb-4">
            Perfect for families or groups of friends, the villa includes a private infinity pool, a
            state-of-the-art kitchen, and spacious living areas designed for relaxation and entertainment.
            Just a 5-minute drive to the beach and 15 minutes to the city center.
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
          {[
            { icon: "wifi", text: "Fast Wifi - 200 Mbps" },
            { icon: "pool", text: "Private infinity pool" },
            { icon: "kitchen", text: "Kitchen" },
            { icon: "ac_unit", text: "Central air conditioning" },
            { icon: "local_laundry_service", text: "Washer & Dryer" },
            { icon: "directions_car", text: "Free parking on premises" },
            { icon: "tv", text: '65" HDTV with Netflix' },
            { icon: "desk", text: "Dedicated workspace" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <button className="mt-8 px-6 py-3 border border-gray-800 dark:border-gray-200 rounded-lg font-semibold text-[#0d141b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Show all 32 amenities
        </button>
      </div>
    </div>
  );
};

export default ListingInfo;

