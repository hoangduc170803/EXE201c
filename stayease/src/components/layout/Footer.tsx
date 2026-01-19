import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-12 pb-8 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Support */}
          <div>
            <h4 className="font-bold text-[#0d141b] dark:text-white mb-4">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:underline" to="#">Help Center</Link></li>
              <li><Link className="hover:underline" to="#">AirCover</Link></li>
              <li><Link className="hover:underline" to="#">Anti-discrimination</Link></li>
              <li><Link className="hover:underline" to="#">Disability support</Link></li>
              <li><Link className="hover:underline" to="#">Cancellation options</Link></li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h4 className="font-bold text-[#0d141b] dark:text-white mb-4">
              Hosting
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:underline" to="/host">StayEase your home</Link></li>
              <li><Link className="hover:underline" to="#">AirCover for Hosts</Link></li>
              <li><Link className="hover:underline" to="#">Hosting resources</Link></li>
              <li><Link className="hover:underline" to="#">Community forum</Link></li>
              <li><Link className="hover:underline" to="#">Hosting responsibly</Link></li>
            </ul>
          </div>

          {/* StayEase */}
          <div>
            <h4 className="font-bold text-[#0d141b] dark:text-white mb-4">
              StayEase
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:underline" to="#">Newsroom</Link></li>
              <li><Link className="hover:underline" to="#">New features</Link></li>
              <li><Link className="hover:underline" to="#">Careers</Link></li>
              <li><Link className="hover:underline" to="#">Investors</Link></li>
              <li><Link className="hover:underline" to="#">Gift cards</Link></li>
            </ul>
          </div>

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined !text-[28px] text-primary">
                travel_explore
              </span>
              <h4 className="font-bold text-[#0d141b] dark:text-white text-lg">
                StayEase
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Find the perfect place to stay for your next adventure.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>© 2024 StayEase, Inc.</span>
            <span className="hidden md:inline">·</span>
            <Link className="hover:underline" to="#">Privacy</Link>
            <span className="hidden md:inline">·</span>
            <Link className="hover:underline" to="#">Terms</Link>
            <span className="hidden md:inline">·</span>
            <Link className="hover:underline" to="#">Sitemap</Link>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-4 text-[#0d141b] dark:text-white">
              <span className="hover:text-primary transition-colors cursor-pointer text-sm font-semibold">English (US)</span>
              <span className="hover:text-primary transition-colors cursor-pointer text-sm font-semibold">$ USD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

