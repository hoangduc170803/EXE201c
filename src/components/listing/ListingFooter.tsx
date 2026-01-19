import React from 'react';

const ListingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-10 px-4 md:px-10">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-[#0d141b] dark:text-white">Support</h4>
          {['Help Center', 'AirCover', 'Anti-discrimination', 'Disability support'].map((link) => (
            <a key={link} className="text-gray-600 dark:text-gray-400 hover:underline" href="#">
              {link}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-[#0d141b] dark:text-white">Hosting</h4>
          {['StayEase your home', 'AirCover for Hosts', 'Hosting resources', 'Community forum'].map(
            (link) => (
              <a key={link} className="text-gray-600 dark:text-gray-400 hover:underline" href="#">
                {link}
              </a>
            )
          )}
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-[#0d141b] dark:text-white">StayEase</h4>
          {['Newsroom', 'New features', 'Careers', 'Investors'].map((link) => (
            <a key={link} className="text-gray-600 dark:text-gray-400 hover:underline" href="#">
              {link}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary font-black text-xl mb-2">
            <span className="material-symbols-outlined">travel_explore</span>
            <span>StayEase</span>
          </div>
          <p className="text-sm text-gray-500">© 2024 StayEase, Inc.</p>
          <div className="flex gap-4 mt-2">
            <span className="material-symbols-outlined text-gray-600 cursor-pointer hover:text-primary">
              public
            </span>
            <span className="text-sm font-semibold text-gray-600 cursor-pointer hover:text-primary">
              English (US)
            </span>
            <span className="text-sm font-semibold text-gray-600 cursor-pointer hover:text-primary">
              $ USD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ListingFooter;

