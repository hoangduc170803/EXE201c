import React from 'react';
import { User, Heart, History, Settings, LogOut, BadgeCheck } from 'lucide-react';
import { UserProfile } from '@/types';

interface SidebarProps {
  user: UserProfile;
}

const ProfileSidebar: React.FC<SidebarProps> = ({ user }) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sticky top-24">
        {/* User Mini Profile */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-16 ring-2 ring-primary/20" 
            style={{ backgroundImage: `url("${user.avatar}")` }}
          ></div>
          <div className="flex flex-col">
            <h1 className="text-[#0d141b] text-base font-bold leading-normal">{user.name}</h1>
            <p className="text-[#4c739a] text-xs font-normal leading-normal">Thành viên từ {user.joinedYear}</p>
            {user.isVerified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary mt-1 bg-primary/10 px-2 py-0.5 rounded-full w-fit">
                <BadgeCheck className="w-3 h-3 fill-current" />
                Đã xác minh
              </span>
            )}
          </div>
        </div>
        
        {/* Nav Links */}
        <nav className="flex flex-col gap-2">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-colors group" href="#">
            <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Thông tin cá nhân</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#0d141b] hover:bg-slate-50 transition-colors group" href="#">
            <Heart className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Yêu thích</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#0d141b] hover:bg-slate-50 transition-colors group" href="#">
            <History className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Lịch sử đặt phòng</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#0d141b] hover:bg-slate-50 transition-colors group" href="#">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Cài đặt</span>
          </a>
        </nav>
        
        <div className="mt-6 pt-6 border-t border-slate-100">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;

