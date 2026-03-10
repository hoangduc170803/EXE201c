import React, { useState, useEffect } from 'react';
import { Wallet, Plus, History, CreditCard, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

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
  qrCodeUrl: string;
  paymentNotes: string;
}

const WalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('BANK_TRANSFER');

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
      const response = await fetch('http://localhost:8080/api/wallet/payment-info');
      if (response.ok) {
        const data = await response.json();
        setPaymentInfo(data);
      }
    } catch (error) {
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
          transactionNote: 'Nạp tiền vào ví',
        }),
      });

      if (response.ok) {
        const transaction = await response.json();
        alert(`Tạo yêu cầu nạp tiền thành công!\n\nMã giao dịch: ${transaction.transactionCode}\n\nVui lòng chuyển khoản và đợi admin xác nhận.`);
        setShowDepositModal(false);
        setDepositAmount('');
        loadTransactions();
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Failed to create deposit:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
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
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-white text-rose-500 px-6 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nạp tiền
            </button>
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
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(tx.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getTransactionColor(tx.transactionType)}`}>
                        {tx.transactionType === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadge(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Nạp tiền vào ví</h3>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền muốn nạp
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Nhập số tiền (VND)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['BANK_TRANSFER', 'MOMO', 'VNPAY'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setDepositMethod(method)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        depositMethod === method
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-gray-200 hover:border-rose-300'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                      <p className="text-xs font-medium text-gray-900">
                        {method === 'BANK_TRANSFER' ? 'Chuyển khoản' : method}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              {paymentInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">Thông tin chuyển khoản</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Ngân hàng:</span>
                      <span className="font-medium text-blue-900">{paymentInfo.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Số TK:</span>
                      <span className="font-medium text-blue-900">{paymentInfo.bankAccountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Chủ TK:</span>
                      <span className="font-medium text-blue-900">{paymentInfo.bankAccountHolder}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Chi nhánh:</span>
                      <span className="font-medium text-blue-900">{paymentInfo.bankBranch}</span>
                    </div>
                  </div>
                  {paymentInfo.paymentNotes && (
                    <p className="text-xs text-blue-700 mt-3 italic">{paymentInfo.paymentNotes}</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                  className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Tạo yêu cầu nạp tiền
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;

