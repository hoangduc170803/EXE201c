import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-12 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined !text-[28px] text-primary">
                apartment
              </span>
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                StayEase
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Nền tảng cho thuê và đặt phòng uy tín, kết nối bạn với những không gian sống lý tưởng.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="material-symbols-outlined !text-[20px]">facebook</span>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="material-symbols-outlined !text-[20px]">chat</span>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110">
                <span className="material-symbols-outlined !text-[20px]">mail</span>
              </a>
            </div>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">
              Hỗ trợ
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="#">Trung tâm trợ giúp</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">An toàn và bảo mật</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Chính sách hủy</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Tùy chọn hỗ trợ</Link></li>
            </ul>
          </div>

          {/* Khám phá */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">
              Khám phá
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="#">Tin tức</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Blog</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Tuyển dụng</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Nhà đầu tư</Link></li>
            </ul>
          </div>

          {/* Đón tiếp khách */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">
              Đón tiếp khách
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li><Link className="hover:text-primary transition-colors" to="/host">Cho thuê chỗ ở</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Bảo vệ cho Chủ nhà</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Diễn đàn cộng đồng</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="#">Đón tiếp có trách nhiệm</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
            <span>© 2026 StayEase, Inc.</span>
            <span className="mx-2">·</span>
            <Link className="hover:text-primary transition-colors" to="#">Quyền riêng tư</Link>
            <span className="mx-2">·</span>
            <Link className="hover:text-primary transition-colors" to="#">Điều khoản</Link>
            <span className="mx-2">·</span>
            <Link className="hover:text-primary transition-colors" to="#">Sơ đồ trang web</Link>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined !text-lg">language</span>
              <span>Tiếng Việt (VN)</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-primary transition-colors cursor-pointer">
              <span className="font-sans">₫</span>
              <span>VND</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

