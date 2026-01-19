import React from 'react';
import { Briefcase, MessageSquare, Star } from 'lucide-react';
import { StatItem } from '@/types';

const ProfileStats: React.FC = () => {
  const stats: StatItem[] = [
    {
      value: "12",
      label: "Tổng chuyến đi",
      icon: <Briefcase className="w-5 h-5" />,
      iconColorClass: "text-primary",
      iconBgClass: "bg-primary/10",
    },
    {
      value: "5",
      label: "Đánh giá đã viết",
      icon: <MessageSquare className="w-5 h-5" />,
      iconColorClass: "text-green-500",
      iconBgClass: "bg-green-500/10",
    },
    {
      value: "4.8",
      label: "Điểm tín nhiệm",
      icon: <Star className="w-5 h-5 fill-current" />,
      iconColorClass: "text-yellow-500",
      iconBgClass: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col gap-1 rounded-xl border border-[#e7edf3] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <p className="text-[#0d141b] text-2xl font-bold leading-tight">{stat.value}</p>
            <span className={`${stat.iconColorClass} ${stat.iconBgClass} p-2 rounded-full`}>
              {stat.icon}
            </span>
          </div>
          <p className="text-[#4c739a] text-xs font-medium uppercase tracking-wider mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;

