import React from 'react';
import { HostDto } from '@/services/api';

interface HostProfileProps {
  host: HostDto;
}

const HostProfile: React.FC<HostProfileProps> = ({ host }) => {
  return (
    <div className="py-12 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <div className="bg-white dark:bg-[#1A2633] p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div
                className="bg-cover bg-center rounded-full size-28 border border-gray-200"
                style={{
                  backgroundImage: `url('${host.avatarUrl || 'https://via.placeholder.com/150'}')`,
                }}
              ></div>
              {host.isVerified && (
                <div className="absolute bottom-1 right-0 bg-primary text-white rounded-full p-1.5 border-4 border-white dark:border-[#1A2633]">
                  <span className="material-symbols-outlined text-lg filled">military_tech</span>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-[#0d141b] dark:text-white">{host.firstName} {host.lastName}</h3>
            {host.isVerified && <p className="text-sm font-semibold text-gray-500 mb-4">Verified Host</p>}

            {/* Mock stats for now as not in HostDto */}
            <div className="flex flex-col w-full gap-2 text-left px-4">
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-600 py-2">
                <span className="text-gray-600 dark:text-gray-400">Reviews</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-600 py-2">
                <span className="text-gray-600 dark:text-gray-400">Rating</span>
                <span className="font-bold">4.8</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 w-full md:w-2/3">
          <h3 className="text-2xl font-bold text-[#0d141b] dark:text-white">
            Hosted by {host.firstName} {host.lastName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg whitespace-pre-line">
            {host.bio || `Hi, I'm ${host.firstName}! I'm excited to host you.`}
          </p>
          <div className="flex flex-col gap-3 mt-4">
            {/* Static placeholders or remove if strict */}
            <div className="flex gap-3 items-start">
              <span className="material-symbols-outlined text-gray-500">translate</span>
              <span className="text-gray-700 dark:text-gray-300">
                Speaks English and Vietnamese
              </span>
            </div>
          </div>
          <button className="mt-6 w-fit px-6 py-3 bg-white dark:bg-transparent border border-black dark:border-white rounded-lg font-bold text-[#0d141b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Contact Host
          </button>
          <div className="flex items-center gap-2 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-500">
            <span className="material-symbols-outlined text-lg text-primary">gpp_good</span>
            <p>
              To protect your payment, never transfer money or communicate outside of the StayEase
              website or app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostProfile;

