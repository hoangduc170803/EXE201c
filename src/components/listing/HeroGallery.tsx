import React from 'react';
import { PropertyImage } from '@/services/api';

interface HeroGalleryProps {
  images: PropertyImage[];
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ images }) => {
  // Ensure we have at least 5 images for the layout, or use placeholders/empty
  const displayImages = images.slice(0, 5);
  const mainImage = displayImages[0]?.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image';
  const subImages = displayImages.slice(1);

  return (
    <div className="relative w-full rounded-xl overflow-hidden mb-10 h-[300px] md:h-[400px] lg:h-[500px]">
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-full">
        {/* Main large image */}
        <div className="col-span-1 md:col-span-2 row-span-2 relative group cursor-pointer">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `url('${mainImage}')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        </div>

        {/* Sub images */}
        {/* We need exactly 4 slots for the grid to look good on desktop */}
        {/* If fewer images, we might want to fill with placeholders or just render what we have and let grid handle it */}
        {/* For this design, let's just map 4 slots and fill if available */}
        {[0, 1, 2, 3].map((index) => {
          const img = subImages[index];
          return (
            <div key={index} className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer">
              {img ? (
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${img.imageUrl}')`,
                  }}
                ></div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              {/* Show button on the last item */}
              {index === 3 && (
                <button className="absolute bottom-4 right-4 bg-white text-black px-4 py-1.5 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-gray-100 transition-colors z-10">
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                  Show all photos
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroGallery;

