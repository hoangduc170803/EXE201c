import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Calendar, BarChart3 } from 'lucide-react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileFavorites from '../components/profile/ProfileFavorites';
import ProfileBookings from '../components/profile/ProfileBookings';
import { useProfile } from '../hooks/useProfile';
import { api } from '../services/api';

const ProfilePage: React.FC = () => {
  const { profile, bookings, loading, error } = useProfile();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabFromUrl && ['profile', 'bookings', 'favorites', 'settings'].includes(tabFromUrl)
      ? tabFromUrl
      : 'profile'
  );

  // Update tab when URL parameter changes
  useEffect(() => {
    if (tabFromUrl && ['profile', 'bookings', 'favorites', 'settings'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleBookingUpdated = () => {
    // Refresh bookings when a booking is updated/cancelled
    globalThis.location.reload(); // Simple way to refresh data
  };

  // Redirect if not authenticated
  if (!api.isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f6f7f8] font-display">
        <ProfileHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#4c739a]">Đang tải thông tin hồ sơ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f6f7f8] font-display">
        <ProfileHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Không thể tải thông tin hồ sơ'}</p>
            <button
              onClick={() => globalThis.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8] font-display page-transition">
      <ProfileHeader />

      {/* Main Layout Container */}
      <div className="flex-1 w-full max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">
          
          <ProfileSidebar
            user={profile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Tab Content */}
            <div className="animate-fadeIn">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Thống kê hoạt động</h3>
                    <ProfileStats />
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Tình trạng tài khoản</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-green-900">Trạng thái tài khoản</p>
                          <p className="text-sm text-green-700">Đang hoạt động</p>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-blue-900">Xác minh danh tính</p>
                          <p className="text-sm text-blue-700">
                            {profile?.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${profile?.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium text-purple-900">Thành viên từ</p>
                          <p className="text-sm text-purple-700">{profile?.joinedYear}</p>
                        </div>
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium text-orange-900">Điểm tin cậy</p>
                          <p className="text-sm text-orange-700">4.8/5.0</p>
                        </div>
                        <BarChart3 className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Thông tin cá nhân</h3>
                    <ProfileForm initialData={profile} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Danh sách yêu thích</h3>
                    <ProfileFavorites />
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Lịch sử đặt phòng</h3>
                    <ProfileBookings bookings={bookings} onBookingUpdated={handleBookingUpdated} />
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Danh sách yêu thích</h3>
                    <ProfileFavorites />
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Cài đặt tài khoản</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium text-slate-900">Thông báo email</p>
                              <p className="text-sm text-slate-600">Nhận email về đặt phòng và ưu đãi</p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4 text-primary" />
                          </div>

                          <div className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium text-slate-900">Thông báo push</p>
                              <p className="text-sm text-slate-600">Nhận thông báo trên thiết bị</p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4 text-primary" />
                          </div>

                          <div className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium text-slate-900">Chế độ tối</p>
                              <p className="text-sm text-slate-600">Sử dụng giao diện tối</p>
                            </div>
                            <input type="checkbox" className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Bảo mật</h3>
                        <div className="space-y-4">
                          <button className="flex items-center justify-between w-full py-3 text-left">
                            <div>
                              <p className="font-medium text-slate-900">Đổi mật khẩu</p>
                              <p className="text-sm text-slate-600">Cập nhật mật khẩu của bạn</p>
                            </div>
                            <span className="text-primary">→</span>
                          </button>

                          <button className="flex items-center justify-between w-full py-3 text-left">
                            <div>
                              <p className="font-medium text-slate-900">Xác thực hai yếu tố</p>
                              <p className="text-sm text-slate-600">Tăng cường bảo mật tài khoản</p>
                            </div>
                            <span className="text-primary">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'status' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Thống kê hoạt động</h3>
                    <ProfileStats />
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Tình trạng tài khoản</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-green-900">Trạng thái tài khoản</p>
                          <p className="text-sm text-green-700">Đang hoạt động</p>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-blue-900">Xác minh danh tính</p>
                          <p className="text-sm text-blue-700">
                            {profile?.isVerified ? 'Đã xác minh' : 'Chưa xác minh'}
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${profile?.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium text-purple-900">Thành viên từ</p>
                          <p className="text-sm text-purple-700">{profile?.joinedYear}</p>
                        </div>
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                        <div>
                          <p className="font-medium text-orange-900">Điểm tin cậy</p>
                          <p className="text-sm text-orange-700">4.8/5.0</p>
                        </div>
                        <BarChart3 className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

