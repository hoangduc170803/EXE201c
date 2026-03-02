import React from 'react';
import { PropertyDto } from '@/services/api';

interface LongTermListingInfoProps {
  property: PropertyDto;
}

const LongTermListingInfo: React.FC<LongTermListingInfoProps> = ({ property }) => {
  return (
    <div className="lg:col-span-2 flex flex-col gap-8">
      {/* Host Info Header */}
      <div className="flex justify-between items-center py-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">
            Phòng trọ {property.propertyType} - Chủ nhà {property.host.firstName} {property.host.lastName}
          </h2>
          <p className="text-[#4c739a] dark:text-gray-400 mt-1">
            {property.bedrooms} phòng ngủ · {property.beds} giường · {property.bathrooms} phòng tắm
          </p>
        </div>
        <div
          className="bg-cover bg-center rounded-full size-16 border border-gray-200"
          style={{
            backgroundImage: `url('${property.host.avatarUrl || 'https://via.placeholder.com/150'}')`,
          }}
        ></div>
      </div>

      {/* Highlights for Long-term */}
      <div className="flex flex-col gap-6 py-2 border-b border-gray-200 dark:border-gray-700 pb-8">
        {property.host.isVerified && (
          <div className="flex gap-4 items-start">
            <span className="material-symbols-outlined text-2xl text-[#0d141b] dark:text-white mt-1">
              verified
            </span>
            <div>
              <h3 className="font-bold text-[#0d141b] dark:text-white">Chủ nhà đã xác thực</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {property.host.firstName} là chủ nhà uy tín với nhiều đánh giá tốt.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4 items-start">
          <span className="material-symbols-outlined text-2xl text-[#0d141b] dark:text-white mt-1">
            location_on
          </span>
          <div>
            <h3 className="font-bold text-[#0d141b] dark:text-white">Vị trí thuận lợi</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Gần trường học, công sở và các tiện ích công cộng.
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <span className="material-symbols-outlined text-2xl text-[#0d141b] dark:text-white mt-1">
            schedule
          </span>
          <div>
            <h3 className="font-bold text-[#0d141b] dark:text-white">Linh hoạt thời gian</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Có thể xem phòng vào bất kỳ thời gian nào trong tuần.
            </p>
          </div>
        </div>

        {property.minimumLeaseMonths && (
          <div className="flex gap-4 items-start">
            <span className="material-symbols-outlined text-2xl text-[#0d141b] dark:text-white mt-1">
              calendar_month
            </span>
            <div>
              <h3 className="font-bold text-[#0d141b] dark:text-white">
                Hợp đồng tối thiểu {property.minimumLeaseMonths} tháng
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Phù hợp cho thuê dài hạn, ổn định.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="py-2 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Mô tả phòng trọ</h2>
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          <p className="mb-4">
            {property.description}
          </p>
          <button className="font-bold underline text-[#0d141b] dark:text-white flex items-center gap-1 mt-2">
            Xem thêm <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Rental Terms */}
      <div className="py-2 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-6">Điều khoản thuê</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">payments</span>
            <div>
              <p className="font-semibold text-[#0d141b] dark:text-white">Tiền cọc</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {property.depositMonths || 1} tháng tiền thuê
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <div>
              <p className="font-semibold text-[#0d141b] dark:text-white">Thời gian tối thiểu</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {property.minimumLeaseMonths || 3} tháng
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">bolt</span>
            <div>
              <p className="font-semibold text-[#0d141b] dark:text-white">Điện</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {property.electricityCost || 'Liên hệ'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">water_drop</span>
            <div>
              <p className="font-semibold text-[#0d141b] dark:text-white">Nước</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {property.waterCost || 'Liên hệ'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">wifi</span>
            <div>
              <p className="font-semibold text-[#0d141b] dark:text-white">Internet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {property.internetCost || 'Liên hệ'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">door_front</span>
            <div>
              <p className="font-semibold text-[#0d141b] dark:text-white">Giờ giấc</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Linh hoạt, tự do
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="py-2 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-6">Tiện nghi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {property.amenities.slice(0, 10).map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="material-symbols-outlined">{amenity.icon || 'check_circle'}</span>
              <span>{amenity.name}</span>
            </div>
          ))}
        </div>
        {property.amenities.length > 10 && (
          <button className="mt-8 px-6 py-3 border border-gray-800 dark:border-gray-200 rounded-lg font-semibold text-[#0d141b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Xem tất cả {property.amenities.length} tiện nghi
          </button>
        )}
      </div>

      {/* House Rules */}
      <div className="py-2 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-6">Nội quy phòng trọ</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-600">schedule</span>
            <span className="text-gray-700 dark:text-gray-300">
              Check-in: Linh hoạt theo thỏa thuận
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-600">no_crash</span>
            <span className="text-gray-700 dark:text-gray-300">
              Không gây tiếng ồn sau 22h
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-600">cleaning_services</span>
            <span className="text-gray-700 dark:text-gray-300">
              Giữ gìn vệ sinh chung
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-600">lock</span>
            <span className="text-gray-700 dark:text-gray-300">
              Bảo mật, an toàn 24/7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongTermListingInfo;

