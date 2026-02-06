import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileHeader: React.FC = () => {
  const { user } = useAuth();

  const displayName = user
    ? (user.fullName || `${user.firstName} ${user.lastName}`)
    : 'Người dùng';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7edf3] bg-white px-4 py-3 md:px-10 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Globe className="w-8 h-8" strokeWidth={1.5} />
          <h2 className="text-[#0d141b] text-xl font-bold leading-tight tracking-[-0.015em]">StayEase</h2>
        </Link>
        <div className="hidden md:flex items-center gap-9">
          <Link className="text-[#0d141b] text-sm font-medium leading-normal hover:text-primary transition-colors" to="/">Trang chủ</Link>
          <Link className="text-[#0d141b] text-sm font-medium leading-normal hover:text-primary transition-colors" to="#">Trải nghiệm</Link>
          <Link className="text-[#0d141b] text-sm font-medium leading-normal hover:text-primary transition-colors" to="#">Trợ giúp</Link>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-4 md:gap-8">
        <div className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-[#e7edf3] bg-[#f6f7f8] overflow-hidden group focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <div className="text-[#4c739a] flex items-center justify-center pl-4 pr-2">
              <Search className="w-5 h-5" />
            </div>
            <input 
              className="flex w-full min-w-0 flex-1 resize-none bg-transparent text-[#0d141b] focus:outline-0 border-none placeholder:text-[#4c739a] px-2 text-sm font-normal leading-normal h-full" 
              placeholder="Tìm kiếm..."
              aria-label="Tìm kiếm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden sm:block">{displayName}</span>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" 
            style={{
              backgroundImage: `url("${user?.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEVo4ajHUihBlJYshx3YW16eZoDUwtVItNNXKt954oQMSKoZKvQ8lO3qdsSDy4mX188lc8fdBJQptlXHZ60x6HvKQ8OB0ZVEqKlP6Hs1CHZGTp0_saDFWmB7cFgaNxx147QXRw2-wAhForBmrazgW5eEXHgOuJ9yAqwRvry8vmiRD_KiYZsQT9Zw7aUoHNmc_K29RDmm_tkrApQpQCTQMCUNYw9fGXw_UuFRTjGX8vKYR6J3LBtVP2a8NfN7lJAw6Iy0h5TKvT7ho'}")`
            }}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;

