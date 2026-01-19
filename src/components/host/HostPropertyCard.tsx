import React from 'react';
import { HostProperty } from '@/types';

interface PropertyCardProps {
  property: HostProperty;
}

const HostPropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price?: number) => {
    if (!price) return 'Price not set';
    return new Intl.NumberFormat('en-US').format(price);
  };

  const isDraft = property.status === 'Draft';

  return (
    <div className="group flex flex-col bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 ${isDraft ? 'opacity-80' : ''}`}
          style={{ backgroundImage: `url("${property.imageUrl}")` }}
        />
        <div className="absolute top-3 right-3">
          <span className={`backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
            property.status === 'Active' ? 'bg-green-500/90' : 'bg-slate-500/90'
          }`}>
            {property.status}
          </span>
        </div>
        <button className="absolute top-3 left-3 bg-white/90 dark:bg-black/50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black">
          <span className="material-symbols-outlined text-[18px] text-slate-700 dark:text-slate-200">edit</span>
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{property.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              {property.location}
            </p>
          </div>
          <button className="text-slate-400 hover:text-primary -mr-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <p className={`font-bold ${property.isPriceSet ? 'text-primary' : 'text-slate-400'}`}>
              {formatPrice(property.price)} 
              {property.isPriceSet && <span className="text-xs font-normal text-slate-500 ml-1">/ night</span>}
            </p>
            <div className={`flex items-center gap-1 ${property.rating ? 'text-amber-500' : 'text-slate-300'}`}>
              <span className={`material-symbols-outlined text-[18px] ${property.rating ? 'fill-1' : ''}`}>star</span>
              <span className="text-sm font-bold">{property.rating || '-'}</span>
            </div>
          </div>

          {isDraft ? (
            <div className="flex items-center justify-center text-xs text-primary font-bold bg-primary/5 dark:bg-primary/10 p-2 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
              <span>Finish Listing</span>
              <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">event_upcoming</span>
                <span>{property.upcomingBookings || 0} upcoming</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-400">visibility</span>
                <span>{property.views ? (property.views >= 1000 ? `${(property.views/1000).toFixed(1)}k` : property.views) : 0} views</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostPropertyCard;

