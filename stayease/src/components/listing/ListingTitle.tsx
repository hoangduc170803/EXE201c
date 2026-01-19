import React from 'react';

const ListingTitle: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#0d141b] dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.033em]">
          Luxury Villa with Ocean View in Da Nang
        </h1>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-sm md:text-base text-[#0d141b] dark:text-gray-300 font-medium">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm filled">star</span>
              4.92
            </span>
            <span>·</span>
            <a className="underline font-semibold hover:text-primary" href="#">
              120 reviews
            </a>
            <span>·</span>
            <span className="flex items-center gap-1 text-[#4c739a] dark:text-gray-400">
              <span className="material-symbols-outlined text-sm filled text-rose-500">
                military_tech
              </span>
              Superhost
            </span>
            <span>·</span>
            <a
              className="underline text-[#4c739a] dark:text-gray-400 hover:text-primary"
              href="#location"
            >
              Da Nang, Vietnam
            </a>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold underline">
              <span className="material-symbols-outlined text-[18px]">ios_share</span>
              Share
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold underline">
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingTitle;

