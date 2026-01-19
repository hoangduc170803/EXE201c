import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { UserProfile } from '@/types';

interface ProfileFormProps {
  initialData: UserProfile;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e7edf3] overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-[#e7edf3] flex justify-between items-center bg-slate-50/50">
        <h3 className="text-[#0d141b] text-lg font-bold">Thông tin cá nhân</h3>
        <button className="text-primary text-sm font-semibold hover:underline">Chỉnh sửa</button>
      </div>
      
      <div className="p-6">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-[#0d141b] mb-2">Họ và tên</label>
            <input 
              name="name"
              className="w-full h-11 px-4 rounded-lg bg-slate-50 border border-[#e7edf3] text-[#0d141b] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
              type="text" 
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-[#0d141b] mb-2">Email</label>
            <div className="relative">
              <input 
                name="email"
                className="w-full h-11 px-4 rounded-lg bg-slate-50 border border-[#e7edf3] text-[#0d141b] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                type="email" 
                value={formData.email}
                onChange={handleChange}
              />
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
            </div>
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-[#0d141b] mb-2">Số điện thoại</label>
            <input 
              name="phone"
              className="w-full h-11 px-4 rounded-lg bg-slate-50 border border-[#e7edf3] text-[#0d141b] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
              type="tel" 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-[#0d141b] mb-2">Ngày sinh</label>
            <input 
              name="dob"
              className="w-full h-11 px-4 rounded-lg bg-slate-50 border border-[#e7edf3] text-[#0d141b] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
              type="date" 
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-[#0d141b] mb-2">Địa chỉ</label>
            <textarea 
              name="address"
              className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-[#e7edf3] text-[#0d141b] focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all" 
              rows={2}
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </form>
        
        <div className="mt-8 flex justify-end">
          <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-md shadow-primary/20 transition-all active:scale-95">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;

