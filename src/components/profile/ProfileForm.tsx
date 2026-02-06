import React, { useState, useEffect } from 'react';
import { CheckCircle, Edit, Save } from 'lucide-react';
import { UserProfile } from '@/types';
import { useProfile } from '@/hooks/useProfile';

interface ProfileFormProps {
  initialData: UserProfile;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const { updateProfile, updating } = useProfile();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update form data when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Extract first and last name from full name
    const nameParts = formData.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const updateData = {
      firstName,
      lastName,
      phone: formData.phone,
      dateOfBirth: formData.dob,
      address: formData.address,
    };

    const success = await updateProfile(updateData);
    if (success) {
      setIsEditing(false);
      setSuccessMessage('Thông tin đã được cập nhật thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e7edf3] overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-[#e7edf3] flex justify-between items-center bg-slate-50/50">
        <h3 className="text-[#0d141b] text-lg font-bold">Thông tin cá nhân</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-primary text-sm font-semibold hover:underline"
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm">
          {successMessage}
        </div>
      )}

      <div className="p-6">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-[#0d141b] mb-2">Họ và tên</label>
            <input 
              name="name"
              className={`w-full h-11 px-4 rounded-lg border border-[#e7edf3] text-[#0d141b] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                isEditing ? 'bg-white' : 'bg-slate-50'
              }`}
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-[#0d141b] mb-2">Email</label>
            <div className="relative">
              <input 
                name="email"
                className="w-full h-11 px-4 rounded-lg bg-slate-50 border border-[#e7edf3] text-[#0d141b] outline-none cursor-not-allowed"
                type="email"
                value={formData.email}
                disabled
              />
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Email không thể thay đổi</p>
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-[#0d141b] mb-2">Số điện thoại</label>
            <input 
              name="phone"
              className={`w-full h-11 px-4 rounded-lg border border-[#e7edf3] text-[#0d141b] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                isEditing ? 'bg-white' : 'bg-slate-50'
              }`}
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-[#0d141b] mb-2">Ngày sinh</label>
            <input 
              name="dob"
              className={`w-full h-11 px-4 rounded-lg border border-[#e7edf3] text-[#0d141b] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                isEditing ? 'bg-white' : 'bg-slate-50'
              }`}
              type="date"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-[#0d141b] mb-2">Địa chỉ</label>
            <textarea 
              name="address"
              className={`w-full px-4 py-2 rounded-lg border border-[#e7edf3] text-[#0d141b] focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all ${
                isEditing ? 'bg-white' : 'bg-slate-50'
              }`}
              rows={2}
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </form>
        
        {isEditing && (
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={updating}
              className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;

