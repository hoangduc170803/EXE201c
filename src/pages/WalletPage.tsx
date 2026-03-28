import React, { useState, useEffect } from 'react';
import { Wallet, Plus, History, ArrowUpCircle, ArrowDownCircle, Copy, CheckCircle, Building2, Smartphone, CreditCard, X, Clock, AlertCircle, ImageIcon, FileCheck, HelpCircle, Sparkles } from 'lucide-react';

interface WalletData {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  balance: number;
  totalDeposited: number;
  totalSpent: number;
  isActive: boolean;
  currency: string;
}

interface Transaction {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND' | 'COMMISSION' | 'ADJUSTMENT';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  description: string;
  referenceId?: string;
  paymentMethod?: string;
  transactionCode: string;
  balanceBefore: number;
  balanceAfter: number;
  notes?: string;
  createdAt: string;
}

interface PaymentInfo {
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankBranch: string;
  bankBin: string; // Added for VietQR
  qrCodeUrl: string; // Kept as fallback
  paymentNotes: string;
}

const WalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferGuide, setShowTransferGuide] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('BANK_TRANSFER');
  const [depositStep, setDepositStep] = useState<'input' | 'proof' | 'done'>('input');
  const [createdTransaction, setCreatedTransaction] = useState<Transaction | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQrFull, setShowQrFull] = useState(false);
  const [vietQrUrl, setVietQrUrl] = useState('');
  // Proof step states
  const [transferReference, setTransferReference] = useState('');
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [proofPreview, setProofPreview] = useState('');
  const [uploadingProof, setUploadingProof] = useState(false);

  useEffect(() => {
    loadWalletData();
    loadTransactions();
    loadPaymentInfo();
  }, []);

  const loadWalletData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/wallet', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
      }
    } catch (error) {
      console.error('Failed to load wallet:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/wallet/transactions?page=0&size=10', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.content || []);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/wallet/payment-info', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        setPaymentInfo(data);
        // Generate VietQR URL
        if (data.bankBin && data.bankAccountNumber) {
          const url = `https://img.vietqr.io/image/${data.bankBin}-${data.bankAccountNumber}-compact.png?accountName=${encodeURIComponent(data.bankAccountHolder)}`;
          setVietQrUrl(url);
        }
      }
    }catch (error) {
        console.error('Failed to load payment info:', error);
      }
    };

  const handleDeposit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          paymentMethod: depositMethod,
          transactionNote: `Nạp tiền via ${depositMethod}`,
        }),
      });

      if (response.ok) {
        const transaction = await response.json();
        setCreatedTransaction(transaction);
        // Go to proof step (only for bank transfer), else done directly
        if (depositMethod === 'BANK_TRANSFER') {
          setDepositStep('proof');
        } else {
          setDepositStep('done');
        }
        loadTransactions();
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Failed to create deposit:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProof(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('files', file);
      const response = await fetch('http://localhost:8080/api/files/upload-images', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          const url = data.data[0].url;
          setProofImageUrl(url);
          setProofPreview(url.startsWith('http') ? url : `http://localhost:8080${url}`);
        }
      } else {
        alert('Upload ảnh thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Upload proof failed:', error);
    } finally {
      setUploadingProof(false);
    }
  };

  const handleSubmitProof = async (skip = false) => {
    if (!createdTransaction) { setDepositStep('done'); return; }
    if (!skip) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:8080/api/wallet/deposit/${createdTransaction.transactionCode}/proof`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            transferReference: transferReference.trim() || null,
            proofImageUrl: proofImageUrl || null,
          }),
        });
      } catch (error) {
        console.error('Submit proof failed:', error);
      }
    }
    setDepositStep('done');
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const closeModal = () => {
    setShowDepositModal(false);
    setDepositStep('input');
    setDepositAmount('');
    setCreatedTransaction(null);
    setCopiedField(null);
    setTransferReference('');
    setProofImageUrl('');
    setProofPreview('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'text-green-600';
      case 'PAYMENT':
        return 'text-red-600';
      case 'REFUND':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const paymentMethods = [
    { id: 'BANK_TRANSFER', label: 'Chuyển khoản', icon: Building2, color: 'blue', desc: 'Ngân hàng / Internet Banking' },
    { id: 'MOMO', label: 'MoMo', icon: Smartphone, color: 'pink', desc: 'Ví điện tử MoMo' },
    { id: 'VNPAY', label: 'VNPay', icon: CreditCard, color: 'indigo', desc: 'Cổng thanh toán VNPay' },
  ];

  const quickAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-rose-500" />
            Ví của tôi
          </h1>
          <p className="text-gray-600 mt-2">Quản lý số dư và giao dịch</p>
        </div>

        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-rose-100 text-sm mb-2">Số dư khả dụng</p>
              <h2 className="text-4xl font-bold">{formatCurrency(wallet?.balance || 0)}</h2>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => { setShowDepositModal(true); setDepositStep('input'); }}
                className="bg-white text-rose-500 px-6 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nạp tiền
              </button>
              <button
                onClick={() => setShowTransferGuide(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-rose-600 font-semibold shadow hover:bg-white transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Hướng dẫn chuyển khoản
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-rose-400">
            <div>
              <p className="text-rose-100 text-sm mb-1">Tổng đã nạp</p>
              <p className="text-xl font-semibold">{formatCurrency(wallet?.totalDeposited || 0)}</p>
            </div>
            <div>
              <p className="text-rose-100 text-sm mb-1">Tổng đã chi</p>
              <p className="text-xl font-semibold">{formatCurrency(wallet?.totalSpent || 0)}</p>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <History className="w-6 h-6 text-gray-600" />
              Lịch sử giao dịch
            </h3>
          </div>
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Chưa có giao dịch nào</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${tx.transactionType === 'DEPOSIT' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {tx.transactionType === 'DEPOSIT' ? (
                          <ArrowDownCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{tx.description}</p>
                        <p className="text-sm text-gray-500">Mã GD: {tx.transactionCode}</p>
                        {tx.status === 'PENDING' && (
                          <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> Chờ admin xác nhận
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{new Date(tx.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getTransactionColor(tx.transactionType)}`}>
                        {tx.transactionType === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadge(tx.status)}`}>
                        {tx.status === 'PENDING' ? 'Chờ duyệt' : tx.status === 'COMPLETED' ? 'Hoàn thành' : tx.status === 'FAILED' ? 'Thất bại' : tx.status}
                      </span>
                    </div>
                  </div>
                  {tx.notes && tx.status === 'FAILED' && (
                    <div className="mt-3 px-3 py-2 bg-red-50 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-xs text-red-600">{tx.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Nạp tiền vào ví</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {/* Step 1 */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${depositStep === 'input' ? 'bg-rose-500 text-white' : 'bg-green-500 text-white'}`}>
                    {depositStep === 'input' ? '1' : <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`w-10 h-0.5 rounded ${depositStep === 'input' ? 'bg-gray-200' : 'bg-green-400'}`} />
                  {/* Step 2 */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${depositStep === 'proof' ? 'bg-rose-500 text-white' : depositStep === 'done' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {depositStep === 'done' ? <CheckCircle className="w-3.5 h-3.5" /> : '2'}
                  </div>
                  <div className={`w-10 h-0.5 rounded ${depositStep === 'done' ? 'bg-green-400' : 'bg-gray-200'}`} />
                  {/* Step 3 */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${depositStep === 'done' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {depositStep === 'done' ? <CheckCircle className="w-3.5 h-3.5" /> : '3'}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    {depositStep === 'input' ? 'Chọn phương thức' : depositStep === 'proof' ? 'Xác nhận chuyển khoản' : 'Hoàn tất'}
                  </span>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Step 1: Amount + Method + Bank Info inline */}
            {depositStep === 'input' && (
              <div className="p-6 space-y-5">

                {/* Amount */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Số tiền muốn nạp</p>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Nhập số tiền (VND)"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-rose-400 text-lg font-semibold transition-colors outline-none"
                  />
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setDepositAmount(amt.toString())}
                        className={`py-2 text-sm rounded-lg border font-medium transition-all ${
                          depositAmount === amt.toString()
                            ? 'border-rose-500 bg-rose-50 text-rose-600 font-semibold'
                            : 'border-gray-200 text-gray-600 hover:border-rose-300 hover:bg-rose-50'
                        }`}
                      >
                        {amt >= 1000000 ? `${amt / 1000000}tr` : `${amt / 1000}k`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Phương thức thanh toán</p>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = depositMethod === method.id;
                      return (
                        <div key={method.id}>
                          <button
                            onClick={() => setDepositMethod(method.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-rose-500 bg-rose-50'
                                : 'border-gray-200 hover:border-rose-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-rose-100' : 'bg-gray-100'}`}>
                              <Icon className={`w-5 h-5 ${isSelected ? 'text-rose-500' : 'text-gray-500'}`} />
                            </div>
                            <div className="flex-1">
                              <p className={`font-semibold text-sm ${isSelected ? 'text-rose-700' : 'text-gray-900'}`}>{method.label}</p>
                              <p className="text-xs text-gray-500">{method.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? 'border-rose-500 bg-rose-500' : 'border-gray-300'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </button>

                          {/* Bank Info Panel — appears inline when BANK_TRANSFER is selected */}
                          {isSelected && method.id === 'BANK_TRANSFER' && paymentInfo && (
                            <div className="mt-2 ml-2 mr-2 rounded-xl border border-rose-200 bg-white overflow-hidden shadow-sm">
                              {/* QR + Account side by side */}
                              <div className="flex gap-0 divide-x divide-gray-100">

                                {/* QR Code */}
                                {(vietQrUrl) && (
                                  <div className="flex items-center justify-center p-3 bg-gray-50">
                                    <button
                                      onClick={() => setShowQrFull(true)}
                                      className="group relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                                      title="Nhấn để phóng to"
                                    >
                                      <img
                                        src={vietQrUrl}
                                        alt="VietQR Code"
                                        className="w-28 h-28 object-contain"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-lg transition-all">Phóng to</span>
                                      </div>
                                    </button>
                                  </div>
                                )}

                                {/* Account Details */}
                                <div className="flex-1 divide-y divide-gray-100">
                                  <div className="px-3 py-2 bg-rose-500">
                                    <p className="text-xs font-bold text-white uppercase tracking-wide">
                                      {paymentInfo.bankName || 'Thông tin ngân hàng'}
                                    </p>
                                  </div>
                                  {[
                                    { label: 'Số tài khoản', value: paymentInfo.bankAccountNumber, field: 'account', highlight: true },
                                    { label: 'Chủ tài khoản', value: paymentInfo.bankAccountHolder, field: 'holder', highlight: false },
                                    { label: 'Chi nhánh', value: paymentInfo.bankBranch, field: 'branch', highlight: false },
                                  ].filter(r => r.value).map(row => (
                                    <div key={row.field} className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors">
                                      <span className="text-xs text-gray-400 shrink-0 mr-2">{row.label}</span>
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <span className={`text-xs font-bold truncate ${row.highlight ? 'text-rose-600 text-sm' : 'text-gray-800'}`}>
                                          {row.value}
                                        </span>
                                        <button
                                          onClick={() => handleCopy(row.value, row.field)}
                                          className="p-1 hover:bg-gray-200 rounded shrink-0 transition-colors"
                                          title="Sao chép"
                                        >
                                          {copiedField === row.field
                                            ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                            : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Payment notes */}
                              {paymentInfo.paymentNotes && (
                                <div className="px-3 py-2.5 bg-amber-50 border-t border-amber-100 flex gap-2">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <p className="text-xs text-amber-700">{paymentInfo.paymentNotes}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* MoMo / VNPay - coming soon notice */}
                          {isSelected && method.id !== 'BANK_TRANSFER' && (
                            <div className="mt-2 ml-2 mr-2 bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                              <p className="text-sm text-blue-700 font-medium">Đang cập nhật</p>
                              <p className="text-xs text-blue-500 mt-0.5">Vui lòng dùng Chuyển khoản ngân hàng</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleDeposit}
                  disabled={!depositAmount || Number(depositAmount) < 10000}
                  className="w-full py-3.5 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 active:bg-rose-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  {depositMethod === 'BANK_TRANSFER' ? 'Tôi đã chuyển khoản →' : 'Tạo yêu cầu nạp tiền'}
                </button>
                {depositMethod === 'BANK_TRANSFER' && depositAmount && Number(depositAmount) >= 10000 && (
                  <p className="text-xs text-center text-gray-400">
                    Chuyển khoản xong mới nhấn nút để tiếp tục gửi xác nhận
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Proof — upload receipt + reference number */}
            {depositStep === 'proof' && createdTransaction && (
              <div className="p-6 space-y-5">
                {/* Instruction */}
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-rose-700">
                    <p className="font-semibold mb-1">Ghi nội dung chuyển khoản</p>
                    <p>Vui lòng ghi <strong>mã giao dịch</strong> vào nội dung chuyển khoản:</p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="bg-white border border-rose-300 px-3 py-1.5 rounded-lg font-mono font-bold text-rose-600 text-sm">
                        {createdTransaction.transactionCode}
                      </code>
                      <button
                        onClick={() => handleCopy(createdTransaction.transactionCode, 'proof-code')}
                        className="p-1.5 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        {copiedField === 'proof-code'
                          ? <CheckCircle className="w-4 h-4 text-green-500" />
                          : <Copy className="w-4 h-4 text-rose-400" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transfer Reference */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Mã tham chiếu ngân hàng
                    <span className="text-gray-400 font-normal ml-1">(không bắt buộc)</span>
                  </label>
                  <input
                    type="text"
                    value={transferReference}
                    onChange={(e) => setTransferReference(e.target.value)}
                    placeholder="VD: FT26071234567"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-400 outline-none transition-colors text-sm font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-1">Mã tham chiếu do ngân hàng cấp sau khi chuyển khoản thành công</p>
                </div>

                {/* Receipt Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ảnh biên lai chuyển khoản
                    <span className="text-gray-400 font-normal ml-1">(không bắt buộc)</span>
                  </label>

                  {proofPreview ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-green-300 bg-green-50">
                      <img src={proofPreview} alt="Biên lai" className="w-full max-h-48 object-contain p-2" />
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                          <CheckCircle className="w-3 h-3" /> Đã upload
                        </div>
                        <button
                          onClick={() => { setProofImageUrl(''); setProofPreview(''); }}
                          className="bg-white/90 p-1 rounded-full hover:bg-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploadingProof ? 'border-rose-300 bg-rose-50' : 'border-gray-300 bg-gray-50 hover:border-rose-400 hover:bg-rose-50'}`}>
                      <input type="file" accept="image/*" className="hidden" onChange={handleProofUpload} disabled={uploadingProof} />
                      {uploadingProof ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500" />
                          <p className="text-xs text-rose-500 font-medium">Đang tải ảnh...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-2 bg-gray-200 rounded-full">
                            <ImageIcon className="w-5 h-5 text-gray-500" />
                          </div>
                          <p className="text-sm text-gray-600 font-medium">Chọn ảnh biên lai</p>
                          <p className="text-xs text-gray-400">Screenshot, chụp màn hình giao dịch NH</p>
                        </div>
                      )}
                    </label>
                  )}
                </div>

                {/* Buttons */}
                <button
                  onClick={() => handleSubmitProof(false)}
                  disabled={uploadingProof}
                  className="w-full py-3.5 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileCheck className="w-5 h-5" />
                  Gửi xác nhận
                </button>
                <button
                  onClick={() => handleSubmitProof(true)}
                  className="w-full py-2.5 text-gray-500 text-sm hover:text-gray-700 transition-colors"
                >
                  Bỏ qua, tôi sẽ cung cấp sau
                </button>
              </div>
            )}

            {/* Step 3: Done */}
            {depositStep === 'done' && createdTransaction && (
              <div className="p-6 space-y-5 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Yêu cầu đã được gửi!</h4>
                  <p className="text-gray-500 text-sm mt-1">Admin sẽ xác nhận sau khi kiểm tra giao dịch</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Thông tin giao dịch</p>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Số tiền</span>
                    <span className="text-sm font-bold text-emerald-600">{formatCurrency(Number.parseFloat(depositAmount))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mã giao dịch</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-800">{createdTransaction.transactionCode}</code>
                      <button onClick={() => handleCopy(createdTransaction.transactionCode, 'txcode')}>
                        {copiedField === 'txcode'
                          ? <CheckCircle className="w-4 h-4 text-green-500" />
                          : <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />}
                      </button>
                    </div>
                  </div>
                  {transferReference && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mã tham chiếu</span>
                      <code className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono font-semibold">{transferReference}</code>
                    </div>
                  )}
                  {proofPreview && (
                    <div>
                      <span className="text-sm text-gray-600">Biên lai:</span>
                      <img src={proofPreview} alt="Biên lai" className="mt-2 w-full max-h-24 object-contain rounded-lg border border-gray-200" />
                    </div>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">Admin sẽ kiểm tra và cộng tiền vào ví trong thời gian sớm nhất.</p>
                </div>

                <button onClick={closeModal} className="w-full py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors">
                  Hoàn tất
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transfer Guide Popup */}
      {showTransferGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setShowTransferGuide(false)}
              className="absolute top-3 right-3 p-2 bg-gray-100/50 hover:bg-gray-200/60 rounded-full text-gray-600 hover:text-gray-800 transition-colors z-10"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Header with Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
                alt="Hướng dẫn chuyển khoản"
                className="w-full h-40 object-cover rounded-t-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-6 h-6" />
                  Hướng dẫn nạp tiền
                </h3>
                <p className="text-white/90 text-sm mt-1">Làm theo các bước sau để được cộng tiền nhanh nhất.</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Tip Box */}
              <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4">
                <Sparkles className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-rose-700">Mẹo nạp nhanh</p>
                  <p className="text-gray-600">
                    Copy đúng <strong>số tài khoản</strong>, giữ nguyên <strong>nội dung chuyển khoản</strong> kèm <strong>mã giao dịch</strong> và <strong>chụp lại biên lai</strong> ngay sau khi chuyển.
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 text-xs font-bold rounded-full flex items-center justify-center">1</div>
                  <div className="text-sm text-gray-700 -mt-0.5">
                    <p className="font-semibold">Tạo yêu cầu & Sao chép thông tin</p>
                    <p className="text-gray-500">Nhập số tiền, chọn phương thức Chuyển khoản và sao chép thông tin tài khoản của StayEase.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 text-xs font-bold rounded-full flex items-center justify-center">2</div>
                  <div className="text-sm text-gray-700 -mt-0.5">
                    <p className="font-semibold">Chuyển khoản với đúng nội dung</p>
                    <p className="text-gray-500">Mở app ngân hàng, thực hiện chuyển khoản và điền <strong>Mã giao dịch</strong> được cung cấp vào nội dung.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 text-xs font-bold rounded-full flex items-center justify-center">3</div>
                  <div className="text-sm text-gray-700 -mt-0.5">
                    <p className="font-semibold">Gửi xác nhận</p>
                    <p className="text-gray-500">Quay lại và nhấn nút "Tôi đã chuyển khoản", sau đó tải lên ảnh biên lai để admin xác minh.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-200 text-gray-600 text-xs font-bold rounded-full flex items-center justify-center">4</div>
                  <div className="text-sm text-gray-700 -mt-0.5">
                    <p className="font-semibold">Chờ duyệt</p>
                    <p className="text-gray-500">Admin sẽ kiểm tra và cộng tiền vào ví trong 5-10 phút. Theo dõi trạng thái trong Lịch sử giao dịch.</p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Lưu ý quan trọng:</p>
                  <p>Không thay đổi số tiền hoặc nội dung sau khi đã tạo yêu cầu. Nếu cần hỗ trợ, hãy liên hệ admin qua chat nội bộ.</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowTransferGuide(false)}
                className="w-full py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors"
              >
                Tôi đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Full Screen */}
      {showQrFull && vietQrUrl && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setShowQrFull(false)}
        >
          <button onClick={() => setShowQrFull(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <img
            src={vietQrUrl}
            alt="VietQR Code"
            className="max-w-[85vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default WalletPage;

