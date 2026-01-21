import React, { useState } from 'react';

interface HeroProps {
  onSearch?: (keyword: string) => void;
  initialKeyword?: string;
}

const Hero: React.FC<HeroProps> = ({ onSearch, initialKeyword = '' }) => {
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchKeyword);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-surface-light dark:bg-surface-dark pt-6 pb-10 px-4 sm:px-8 lg:px-12 border-b border-[#e7edf3] dark:border-gray-800">
      <div className="mx-auto max-w-[1440px]">
        {/* Hero Content */}
        <div
          className="relative overflow-hidden rounded-3xl bg-cover bg-center min-h-[520px] md:min-h-[480px] w-full flex flex-col items-center justify-center text-center px-4 py-12"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-whOX4EE0loBF-tGCUZ1ZoRTw3FlAOvJ9v5P8gHzDNOJv3k5WcaI95m7fJ-ddtcsWWP6yi5lPTjq8gxvEDVRoJ2BNj7BhcZR-esIExGjCRdbYOuFtnIefnlNLGfwuuqWN9ZzbmwHW4wsEqv4eDQhQG7vekiP9zYuY7FPL7RSAUfIx33gehk0w9JMeGeM9iwrUCaHnWoT4-gznCsUaNHRyEV6XJln72aBpipZp_JGmssTdVKeUhOJHO_f7Pkrun_uQiW7FrLg_HD4')",
          }}
        >
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8">
            <div className="space-y-4 md:space-y-2">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md px-2">
                Find your next adventure
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-sm px-4">
                Discover hotels, homes, and unique stays around the world.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-[850px] bg-white dark:bg-gray-800 rounded-[32px] md:rounded-full shadow-xl flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700 overflow-hidden md:overflow-visible p-0 md:p-2">
              {/* Location */}
              <div className="relative flex-1 w-full px-8 py-4 md:px-6 md:py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 md:rounded-full cursor-pointer transition-colors group text-left">
                <label className="block text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
                  Where
                </label>
                <input
                  className="w-full border-none p-0 text-sm bg-transparent focus:ring-0 placeholder:text-gray-400 text-gray-700 dark:text-gray-200 truncate focus:outline-none"
                  placeholder="Search destinations"
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* Check in */}
              <div className="relative w-full md:w-[160px] px-8 py-4 md:px-6 md:py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 md:rounded-full cursor-pointer transition-colors group text-left">
                <label className="block text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
                  Check in
                </label>
                <div className="text-sm text-gray-400">Add dates</div>
              </div>

              {/* Check out */}
              <div className="relative w-full md:w-[160px] px-8 py-4 md:px-6 md:py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 md:rounded-full cursor-pointer transition-colors group text-left">
                <label className="block text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
                  Check out
                </label>
                <div className="text-sm text-gray-400">Add dates</div>
              </div>

              {/* Guests & Search Button */}
              <div className="relative flex-1 w-full pl-8 pr-3 py-3 md:pl-6 md:pr-2 md:py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 md:rounded-full cursor-pointer transition-colors text-left">
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-[#0d141b] dark:text-white uppercase tracking-wider mb-0.5">
                    Who
                  </label>
                  <div className="text-sm text-gray-400">Add guests</div>
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-primary hover:bg-blue-600 text-white h-12 w-12 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 shrink-0 z-10"
                >
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
