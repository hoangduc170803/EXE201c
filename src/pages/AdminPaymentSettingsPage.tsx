import React, { useState, useEffect } from 'react';
import { Save, Upload, Eye, EyeOff, Check, X, Maximize2 } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

interface PaymentSetting {
  id: number;
  settingKey: string;
  settingValue: string;
  description: string;
  isActive: boolean;
  category: string;
}

interface PaymentInfo {
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankBranch: string;
  qrCodeUrl: string;
  paymentNotes: string;
}

const AdminPaymentSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PaymentSetting[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    bankName: '',
    bankAccountNumber: '',
    bankAccountHolder: '',
    bankBranch: '',
    qrCodeUrl: '',
    paymentNotes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showFullPreview, setShowFullPreview] = useState(false);

  useEffect(() => {
    loadSettings();
    // Removed loadPaymentInfo() call to rely on admin settings source of truth
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/admin/payment-settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        console.log('Loaded payment settings:', data.length, 'items');

        // Populate form from settings
        const newPaymentInfo = { ...paymentInfo };
        let hasChanges = false;

        data.forEach((setting: PaymentSetting) => {
          switch (setting.settingKey) {
            case 'BANK_NAME':
              newPaymentInfo.bankName = setting.settingValue;
              hasChanges = true;
              break;
            case 'BANK_ACCOUNT_NUMBER':
              newPaymentInfo.bankAccountNumber = setting.settingValue;
              hasChanges = true;
              break;
            case 'BANK_ACCOUNT_HOLDER':
              newPaymentInfo.bankAccountHolder = setting.settingValue;
              hasChanges = true;
              break;
            case 'BANK_BRANCH':
              newPaymentInfo.bankBranch = setting.settingValue;
              hasChanges = true;
              break;
            case 'QR_CODE_URL':
              newPaymentInfo.qrCodeUrl = setting.settingValue;
              if (setting.settingValue && !setting.settingValue.startsWith('http')) {
                 setQrPreview(`http://localhost:8080${setting.settingValue}`);
              } else if (setting.settingValue) {
                 setQrPreview(setting.settingValue);
              }
              hasChanges = true;
              break;
            case 'PAYMENT_NOTES':
              newPaymentInfo.paymentNotes = setting.settingValue;
              hasChanges = true;
              break;
          }
        });

        if (hasChanges) {
          setPaymentInfo(newPaymentInfo);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentInfo = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/wallet/payment-info');
      if (response.ok) {
        const data = await response.json();
        setPaymentInfo(data);
        if (data.qrCodeUrl) {
          setQrPreview(`http://localhost:8080${data.qrCodeUrl}`);
        }
      }
    } catch (error) {
      console.error('Failed to load payment info:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      let currentQrUrl = paymentInfo.qrCodeUrl;

      // Upload QR code if new file selected
      if (qrFile) {
        const formData = new FormData();
        formData.append('files', qrFile);

        const uploadResponse = await fetch('http://localhost:8080/api/files/upload-images', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          if (uploadData.success && uploadData.data && uploadData.data.length > 0) {
            currentQrUrl = uploadData.data[0].url;
          }
        }
      }

      // Save all settings
      const updates = [
        { settingKey: 'BANK_NAME', settingValue: paymentInfo.bankName, category: 'BANK_INFO' },
        { settingKey: 'BANK_ACCOUNT_NUMBER', settingValue: paymentInfo.bankAccountNumber, category: 'BANK_INFO' },
        { settingKey: 'BANK_ACCOUNT_HOLDER', settingValue: paymentInfo.bankAccountHolder, category: 'BANK_INFO' },
        { settingKey: 'BANK_BRANCH', settingValue: paymentInfo.bankBranch, category: 'BANK_INFO' },
        { settingKey: 'QR_CODE_URL', settingValue: currentQrUrl, category: 'QR_CODE' },
        { settingKey: 'PAYMENT_NOTES', settingValue: paymentInfo.paymentNotes, category: 'PAYMENT_INFO' },
      ];

      for (const update of updates) {
        await fetch('http://localhost:8080/api/admin/payment-settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(update),
        });
      }

      setSuccessMessage('Đã lưu cài đặt thành công!');
      loadSettings();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cài đặt Thanh toán
          </h1>
          <p className="text-gray-600 mt-2">Cấu hình thông tin thanh toán cho hosts</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Bank Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              Thông tin Ngân hàng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên ngân hàng *
                </label>
                <input
                  type="text"
                  value={paymentInfo.bankName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                  placeholder="VD: Vietcombank"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tài khoản *
                </label>
                <div className="relative">
                  <input
                    type={showAccountNumber ? 'text' : 'password'}
                    value={paymentInfo.bankAccountNumber}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, bankAccountNumber: e.target.value })}
                    placeholder="Nhập số tài khoản"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccountNumber(!showAccountNumber)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showAccountNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ tài khoản *
                </label>
                <input
                  type="text"
                  value={paymentInfo.bankAccountHolder}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, bankAccountHolder: e.target.value })}
                  placeholder="VD: CONG TY STAYEASE"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chi nhánh
                </label>
                <input
                  type="text"
                  value={paymentInfo.bankBranch}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, bankBranch: e.target.value })}
                  placeholder="VD: Chi nhánh TP.HCM"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Mã QR Thanh toán
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload QR Code
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrFileChange}
                    className="hidden"
                    id="qr-upload"
                  />
                  <label htmlFor="qr-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click để upload ảnh QR</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (Max 5MB)</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                {qrPreview ? (
                  <div 
                    className="border border-gray-300 rounded-lg p-4 bg-gray-50 relative group cursor-pointer hover:border-rose-400 transition-colors"
                    onClick={() => setShowFullPreview(true)}
                    title="Nhấn để phóng to"
                  >
                    <img
                      src={qrPreview}
                      alt="QR Code"
                      className="w-full h-48 object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-lg">
                      <Maximize2 className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 h-56 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Chưa có QR code</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Notes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Ghi chú Thanh toán
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hướng dẫn cho hosts
              </label>
              <textarea
                value={paymentInfo.paymentNotes}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, paymentNotes: e.target.value })}
                placeholder="VD: Vui lòng ghi rõ mã giao dịch trong nội dung chuyển khoản..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Thông tin này sẽ hiển thị cho hosts khi họ nạp tiền vào ví
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Lưu cài đặt
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Thông tin này sẽ hiển thị cho tất cả hosts khi nạp tiền</li>
                  <li>Đảm bảo số tài khoản chính xác trước khi lưu</li>
                  <li>QR code nên có kích thước tối thiểu 500x500px</li>
                  <li>Hosts sẽ thấy thông tin này khi click "Nạp tiền" trong ví</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {showFullPreview && qrPreview && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowFullPreview(false)}
        >
          <button
            onClick={() => setShowFullPreview(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-full max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={qrPreview}
              alt="QR Code Full Screen"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentSettingsPage;

