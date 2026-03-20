import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  api,
  type BookingSettlementResponse,
  type BookingSettlementStatus,
} from '@/services/api';

const FILTERS: Array<{ value: 'ALL' | BookingSettlementStatus; label: string }> = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'READY_FOR_PAYOUT', label: 'Sẵn sàng chi trả' },
  { value: 'CALCULATED_WAITING_RELEASE', label: 'Chờ đến hạn' },
  { value: 'PAID_OUT', label: 'Đã chi trả' },
  { value: 'ON_HOLD', label: 'On hold' },
];

const statusLabel: Record<BookingSettlementStatus, string> = {
  WAITING_PAYMENT_CONFIRMATION: 'Chờ xác nhận',
  CALCULATED_WAITING_RELEASE: 'Chờ đến hạn',
  READY_FOR_PAYOUT: 'Sẵn sàng chi trả',
  IN_PAYOUT: 'Đang chuyển khoản',
  PAID_OUT: 'Đã chi trả',
  ON_HOLD: 'On hold',
};

const statusClass: Record<BookingSettlementStatus, string> = {
  WAITING_PAYMENT_CONFIRMATION: 'bg-gray-100 text-gray-700',
  CALCULATED_WAITING_RELEASE: 'bg-amber-100 text-amber-800',
  READY_FOR_PAYOUT: 'bg-emerald-100 text-emerald-800',
  IN_PAYOUT: 'bg-blue-100 text-blue-800',
  PAID_OUT: 'bg-green-100 text-green-800',
  ON_HOLD: 'bg-rose-100 text-rose-800',
};

const HostEarningsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<BookingSettlementResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingSettlementStatus>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isHost = !!user && (user.isHost || user.roles?.includes('ROLE_HOST'));

  const loadRows = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getHostSettlements(statusFilter === 'ALL' ? undefined : statusFilter, 0, 100);
      setRows(response.content || []);
    } catch (e: any) {
      setError(e?.message || 'Không tải được dữ liệu thu nhập');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isHost) {
      void loadRows();
    }
  }, [isHost, statusFilter]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.net += row.hostNetAmount || 0;
        if (row.status === 'PAID_OUT') acc.paidOut += row.hostNetAmount || 0;
        if (row.status === 'READY_FOR_PAYOUT') acc.ready += row.hostNetAmount || 0;
        return acc;
      },
      { net: 0, paidOut: 0, ready: 0 }
    );
  }, [rows]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">Bạn chưa đăng nhập</h1>
          <Link to="/auth" className="px-4 py-2 bg-primary text-white rounded-lg font-semibold">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (!isHost) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Cần quyền Host</h1>
          <p className="text-gray-600 mb-4">Trang này dành cho host để theo dõi settlement và payout.</p>
          <Link to="/host" className="px-4 py-2 bg-primary text-white rounded-lg font-semibold">
            Về host portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earnings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Sổ settlement theo booking, minh bạch gross / commission / net để bạn theo dõi dễ hơn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 uppercase">Tổng net</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{formatCurrency(totals.net)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 uppercase">Đã nhận</p>
            <p className="text-xl font-semibold text-emerald-600">{formatCurrency(totals.paidOut)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-500 uppercase">Sắp nhận</p>
            <p className="text-xl font-semibold text-blue-600">{formatCurrency(totals.ready)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              onClick={() => setStatusFilter(item.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                statusFilter === item.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => void loadRows()} className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm">
              Thử lại
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            <p className="text-sm text-gray-500 mt-2">Đang tải dữ liệu...</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center">
            <p className="font-semibold text-lg text-gray-900 dark:text-white">Chưa có settlement nào</p>
            <p className="text-sm text-gray-500 mt-2">Khi booking được admin xác nhận thanh toán, settlement sẽ xuất hiện tại đây.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">#{row.bookingCode}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{row.propertyTitle}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass[row.status]}`}>
                    {statusLabel[row.status]}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Gross</p>
                    <p className="font-semibold">{formatCurrency(row.grossAmount)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Commission</p>
                    <p className="font-semibold text-amber-700">{formatCurrency(row.commissionAmount)}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Net</p>
                    <p className="font-semibold text-emerald-700">{formatCurrency(row.hostNetAmount)}</p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-4">
                  <span>Confirmed: {row.paymentConfirmedAt ? new Date(row.paymentConfirmedAt).toLocaleString('vi-VN') : '--'}</span>
                  <span>Eligible: {row.eligibleForPayoutAt ? new Date(row.eligibleForPayoutAt).toLocaleString('vi-VN') : '--'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostEarningsPage;

