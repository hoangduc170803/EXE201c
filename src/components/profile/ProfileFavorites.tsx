import React from 'react';
import { ArrowRight, MapPin, Star, Heart } from 'lucide-react';
import { FavoriteItem } from '@/types';

const ProfileFavorites: React.FC = () => {
  const favorites: FavoriteItem[] = [
    {
      id: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLd7Jq6WCL7pQwiL9FWuxqVMY-LwTxTNsxToMcCvF7uCCdBDjcTsCu-EckorabIVpE72uGMiOM5A4_pfpvFSFyZi70Wnp0X2LJuZS8yjrhDbF1lba8s4xdj_BX4U595C3vbhhXzaX83J-zkl6v5r8A0dbhT9aTo8uFoNtWwWJcq1fsGXpusR8Hoo03-7TfiY3iLe0IwWXkoiFI7JtydEgczm2CW1NSS8ibLsIKApl9k-qC49JMy-msgTkBYz0Y6LZ4J-unW3lUKjQ",
      title: "Luxury Condo Landmark 81",
      location: "Bình Thạnh, TP.HCM",
      price: "1.500.000₫",
      rating: 4.9
    },
    {
      id: 2,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1ei9hqlVoV5lRWab2Eyvp3SMkcJIGrU1Aw-GXCq9nDwRqjkWY1pnJyObbJjoAXztsWQVybzPdk-nAnJKd2sa8aAa15qPwYZJDdHqBUSCR5v2lzICuKvFrt-_yLHBiHcCuMac3uEcoi1J-Heoe_Q9BrtI-vbdDqh1jUZoy7ktOKxFyETwBUe9N8_QZQ1JrqmquwZc2Y0kBKrtPf5XEwimkDCnlRvx94carDrULnOZjDya-MqoW13H5RKP5wCMV28H8Psh4qtVwSPk",
      title: "Da Lat Wooden Cabin",
      location: "Đà Lạt, Lâm Đồng",
      price: "850.000₫",
      rating: 4.7
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#0d141b] text-lg font-bold">Địa điểm yêu thích</h3>
        <a className="text-primary text-sm font-medium hover:underline flex items-center gap-1" href="#">
          Xem tất cả <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((item) => (
          <div key={item.id} className="group relative flex flex-col sm:flex-row bg-white rounded-xl border border-[#e7edf3] overflow-hidden hover:shadow-md transition-shadow">
            <div 
              className="sm:w-32 h-32 bg-cover bg-center" 
              style={{ backgroundImage: `url("${item.image}")` }}
            ></div>
            
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-[#0d141b] line-clamp-1">{item.title}</h4>
                  <button className="text-red-500 hover:text-red-600 transition-colors">
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location}
                </p>
              </div>
              
              <div className="flex justify-between items-end mt-2">
                <p className="text-primary font-bold">{item.price} <span className="text-slate-400 text-xs font-normal">/ đêm</span></p>
                <div className="flex items-center gap-1 text-xs font-semibold">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {item.rating}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileFavorites;

