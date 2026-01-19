import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileFavorites from '@/components/profile/ProfileFavorites';
import ProfileBookings from '@/components/profile/ProfileBookings';
import { UserProfile } from '@/types';

const ProfilePage: React.FC = () => {
  const user: UserProfile = {
    name: "Minh Nguyễn",
    email: "minh.nguyen@example.com",
    phone: "+84 90 123 4567",
    dob: "1995-08-15",
    address: "Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8KCeimPBwiW5F2w3hGxukT7pB2VTKvDHMJFM9qPmkmKobkh1SmpVn3ODHq87gxjsGvV_T8N8G-hkvY1guE6Rv-GvWitU6fUWJPV9IgBUnW8xZwu8pqFwybfIvgnyJQi-gp1frB1A5Veg5fzo8ygxewUlSrPG2W6t5lLF-x0u-LpYyTfSz4kf92uJFHz51WkINxzQzmPg_YotvNqzobZ0DsLnToJjnopVu3crG-g-B_Nr6qlIBeNzEE7DqPuy2QnWG66uTJrfyj6U",
    joinedYear: 2021,
    isVerified: true
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8] font-display page-transition">
      <ProfileHeader />
      
      {/* Main Layout Container */}
      <div className="flex-1 w-full max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">
          
          <ProfileSidebar user={user} />
          
          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Page Heading */}
            <div className="mb-6">
              <h2 className="text-[#0d141b] text-3xl font-black leading-tight tracking-[-0.033em]">Hồ sơ của tôi</h2>
              <p className="text-[#4c739a] text-base font-normal leading-normal mt-1">Quản lý thông tin cá nhân và bảo mật tài khoản.</p>
            </div>
            
            <ProfileStats />
            
            <ProfileForm initialData={user} />
            
            <ProfileFavorites />
            
            <ProfileBookings />
            
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

