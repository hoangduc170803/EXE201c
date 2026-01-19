import React from 'react';
import { MAP_MARKERS } from '@/constants';

const MapWidget: React.FC = () => {
  return (
    <div className="sticky top-[168px] h-[calc(100vh-200px)] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl bg-[#e5e7eb] dark:bg-[#202932] relative group z-0 transition-colors duration-200">
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <svg className="w-full h-full" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-gray-600" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Decorative map elements simulating roads/parks */}
        <div className="absolute top-1/4 left-0 w-full h-2 bg-white/50 transform -rotate-12"></div>
        <div className="absolute top-3/4 left-0 w-full h-3 bg-white/50 transform rotate-6"></div>
        <div className="absolute top-0 right-1/3 w-2 h-full bg-white/50 transform rotate-12"></div>
        <div className="absolute bottom-0 right-1/4 w-12 h-12 rounded-full bg-blue-300/30"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-green-300/20"></div>
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <button className="bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm flex items-center gap-2 hover:scale-105 transition-transform border border-transparent dark:border-gray-700">
          <span className="material-symbols-outlined !text-[18px]">search</span>
          Search this area
        </button>
      </div>

      {MAP_MARKERS.map((marker) => (
        <button
          key={marker.id}
          style={{ top: marker.top, left: marker.left }}
          className={`absolute z-10 font-bold px-3 py-1 rounded-full shadow-md text-sm border border-gray-200 dark:border-gray-700 transition-all cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
            marker.isActive
              ? 'bg-[#0d141b] text-white dark:bg-white dark:text-[#0d141b] scale-110 z-20'
              : 'bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white hover:scale-110 hover:z-20 hover:bg-[#0d141b] hover:text-white dark:hover:bg-white dark:hover:text-[#0d141b]'
          }`}
        >
          ${marker.price}
        </button>
      ))}

      <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-20">
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-[#0d141b] dark:text-white transition-colors border border-transparent dark:border-gray-700">
          <span className="material-symbols-outlined !text-[20px]">add</span>
        </button>
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-[#0d141b] dark:text-white transition-colors border border-transparent dark:border-gray-700">
          <span className="material-symbols-outlined !text-[20px]">remove</span>
        </button>
      </div>
    </div>
  );
};

export default MapWidget;

