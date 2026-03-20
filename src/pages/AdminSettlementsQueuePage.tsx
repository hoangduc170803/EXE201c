import React, {useEffect, useMemo, useState} from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {
    api,
    type BookingSettlementResponse,
    type BookingSettlementStatus,
    type HostPayoutDetailResponse,
    type HostPayoutStatus,
} from '@/services/api';

const STATUS_OPTIONS: Array<{ value: 'ALL' | BookingSettlementStatus; label: string }> = [
    {value: 'ALL', label: 'Tất cả'},
    {value: 'CALCULATED_WAITING_RELEASE', label: 'Đã tính, chờ đến hạn'},
    {value: 'READY_FOR_PAYOUT', label: 'Sẵn sàng chi trả'},
    {value: 'IN_PAYOUT', label: 'Đang chi trả'},
    {value: 'PAID_OUT', label: 'Đã chi trả'},
    {value: 'ON_HOLD', label: 'On hold'},
];

const statusClasses: Record<BookingSettlementStatus, string> = {
    WAITING_PAYMENT_CONFIRMATION: 'bg-gray-100 text-gray-700',
    CALCULATED_WAITING_RELEASE: 'bg-amber-100 text-amber-800',
    READY_FOR_PAYOUT: 'bg-emerald-100 text-emerald-800',
    IN_PAYOUT: 'bg-blue-100 text-blue-800',
    PAID_OUT: 'bg-green-100 text-green-800',
    ON_HOLD: 'bg-rose-100 text-rose-800',
};

const statusLabel: Record<BookingSettlementStatus, string> = {
    WAITING_PAYMENT_CONFIRMATION: 'Chờ xác nhận thanh toán',
    CALCULATED_WAITING_RELEASE: 'Chờ đến hạn',
    READY_FOR_PAYOUT: 'Sẵn sàng chi trả',
    IN_PAYOUT: 'Đang chi trả',
    PAID_OUT: 'Đã chi trả',
    ON_HOLD: 'On hold',
};

type PayoutModalState = {
    open: boolean;
    loading: boolean;
    submitting: boolean;
    error: string;
    data?: HostPayoutDetailResponse;
    payoutReference: string;
    adminNote: string;
};

const payoutStatusClass: Record<HostPayoutStatus, string> = {
    DUE: 'bg-amber-100 text-amber-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    PAID: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-rose-100 text-rose-800',
};

const payoutStatusLabel: Record<HostPayoutStatus, string> = {
    DUE: 'Đến hạn',
    PROCESSING: 'Đang xử lý',
    PAID: 'Đã trả',
    CANCELLED: 'Đã hủy',
};

const AdminSettlementsQueuePage: React.FC = () => {
    const [rows, setRows] = useState<BookingSettlementResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | BookingSettlementStatus>('ALL');
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [creatingHostId, setCreatingHostId] = useState<number | null>(null);
    const [payoutModal, setPayoutModal] = useState<PayoutModalState>({
        open: false,
        loading: false,
        submitting: false,
        error: '',
        payoutReference: '',
        adminNote: '',
    });
    const [selectedPayoutId, setSelectedPayoutId] = useState<number | null>(null);

    const loadRows = async () => {
        try {
            setLoading(true);
            setError('');
            const result = await api.getAdminSettlements(statusFilter === 'ALL' ? undefined : statusFilter, 0, 100);
            setRows(result.content || []);
        } catch (e: any) {
            setError(e?.message || 'Không tải được settlements queue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadRows();
    }, [statusFilter]);

    const totalReadyAmount = useMemo(
        () => rows.filter((r) => r.status === 'READY_FOR_PAYOUT').reduce((acc, row) => acc + (row.hostNetAmount || 0), 0),
        [rows]
    );

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(amount || 0);

    const markReady = async (id: number) => {
        try {
            setProcessingId(id);
            await api.adminMarkSettlementReady(id);
            await loadRows();
        } catch (e: any) {
            alert(e?.message || 'Không thể chuyển trạng thái READY');
        } finally {
            setProcessingId(null);
        }
    };
    const createPayoutForHost = async (hostId: number) => {
        try {
            setCreatingHostId(hostId);
            const detail = await api.adminCreatePayoutFromReady(hostId);
            await loadRows();
            if (detail?.payout?.id) {
                await openPayoutModal(detail.payout.id);
            } else {
                alert('Đã tạo payout từ các settlement READY cho host');
            }
        } catch (e: any) {
            alert(e?.message || 'Không thể tạo payout tự động cho host');
        } finally {
            setCreatingHostId(null);
        }
    };
    const openPayoutModal = async (payoutId?: number | null) => {
        if (!payoutId) {
            alert('Settlement chưa được gán vào payout batch. Đợi scheduler hoặc tạo payout trước.');
            return;
        }
        setSelectedPayoutId(payoutId);
        setPayoutModal((m) => ({
            ...m,
            open: true,
            loading: true,
            error: '',
            payoutReference: '',
            adminNote: '',
            data: undefined
        }));
        try {
            const detail = await api.getAdminPayoutDetail(payoutId);
            setPayoutModal((m) => ({
                ...m,
                loading: false,
                data: detail,
                payoutReference: detail.payout.payoutReference || '',
                adminNote: detail.payout.adminNote || '',
            }));
        } catch (e: any) {
            setPayoutModal((m) => ({...m, loading: false, error: e?.message || 'Không tải được chi tiết payout'}));
        }
    };

    const closePayoutModal = () => {
        setPayoutModal({open: false, loading: false, submitting: false, error: '', payoutReference: '', adminNote: ''});
        setSelectedPayoutId(null);
    };

    const handleMarkPaid = async () => {
        if (!selectedPayoutId || !payoutModal.data) return;
        if (payoutModal.data.payout.status !== 'PROCESSING') {
            setPayoutModal((m) => ({...m, error: 'Chỉ mark paid khi payout đang PROCESSING'}));
            return;
        }
        const ref = payoutModal.payoutReference.trim();
        if (!ref) {
            setPayoutModal((m) => ({...m, error: 'Vui lòng nhập mã tham chiếu chuyển khoản'}));
            return;
        }
        try {
            setPayoutModal((m) => ({...m, submitting: true, error: ''}));
            await api.adminMarkPayoutPaid(selectedPayoutId, {
                payoutReference: ref,
                adminNote: payoutModal.adminNote?.trim() || undefined
            });
            await loadRows();
            closePayoutModal();
            alert('Đánh dấu đã trả thành công');
        } catch (e: any) {
            setPayoutModal((m) => ({...m, submitting: false, error: e?.message || 'Không thể đánh dấu đã trả'}));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <AdminHeader/>

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Settlements Queue</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Theo dõi gross / commission / net theo từng booking để payout chính xác và dễ đối soát.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
                        <div
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Tổng settlement</p>
                            <p className="text-xl font-semibold">{rows.length}</p>
                        </div>
                        <div
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Ready for payout</p>
                            <p className="text-xl font-semibold text-emerald-600">{formatCurrency(totalReadyAmount)}</p>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setStatusFilter(option.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                statusFilter === option.value
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {error && (
                    <div
                        className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => void loadRows()}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm">
                            Thử lại
                        </button>
                    </div>
                )}

                {loading ? (
                    <div
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center">
                        <span
                            className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                        <p className="mt-3 text-gray-600 dark:text-gray-400">Đang tải settlements...</p>
                    </div>
                ) : rows.length === 0 ? (
                    <div
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-10 text-center">
                        <p className="text-lg font-semibold">Không có settlement nào</p>
                        <p className="text-sm text-gray-500 mt-2">Thử đổi bộ lọc hoặc xác nhận thanh toán booking
                            trước.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rows.map((row) => (
                            <div
                                key={row.id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                                    <div>
                                        <p className="font-semibold text-lg">#{row.bookingCode}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {row.propertyTitle} • Host: {row.hostName}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[row.status]}`}>
                    {statusLabel[row.status]}
                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                        <p className="text-xs text-gray-500">Gross</p>
                                        <p className="font-semibold">{formatCurrency(row.grossAmount)}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                        <p className="text-xs text-gray-500">Commission</p>
                                        <p className="font-semibold text-amber-700">{formatCurrency(row.commissionAmount)}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                                        <p className="text-xs text-gray-500">Net Host</p>
                                        <p className="font-semibold text-emerald-700">{formatCurrency(row.hostNetAmount)}</p>
                                    </div>
                                </div>

                                <div
                                    className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                                    <span>Confirmed: {row.paymentConfirmedAt ? new Date(row.paymentConfirmedAt).toLocaleString('vi-VN') : '--'}</span>
                                    <span>Eligible: {row.eligibleForPayoutAt ? new Date(row.eligibleForPayoutAt).toLocaleString('vi-VN') : '--'}</span>
                                    <span>Rule: {row.commissionRuleId ?? '--'}</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {row.status === 'CALCULATED_WAITING_RELEASE' && (
                                        <button
                                            onClick={() => void markReady(row.id)}
                                            disabled={processingId === row.id}
                                            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50"
                                        >
                                            Chuyển READY
                                        </button>
                                    )}
                                    {row.status === 'READY_FOR_PAYOUT' && (
                                        <>
                                            <button
                                                onClick={() => void openPayoutModal(row.payoutId)}
                                                className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50"
                                            >
                                                Xem payout / mark paid
                                            </button>
                                            {!row.payoutId && (
                                                <>
                                                    <button
                                                        onClick={() => void createPayoutForHost(row.hostId)}
                                                        disabled={creatingHostId === row.hostId}
                                                        className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50"
                                                    >
                                                        {creatingHostId === row.hostId ? 'Đang tạo payout...' : 'Tạo payout auto cho host'}
                                                    </button>
                                                    <span className="text-xs text-gray-500">Chưa gán payoutId - chờ scheduler hoặc tạo payout</span>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {payoutModal.open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div
                            className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                            <div>
                                <p className="text-sm text-gray-500">Payout</p>
                                <h3 className="text-xl font-bold">Mark paid cho host</h3>
                            </div>
                            <button onClick={closePayoutModal}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {payoutModal.loading ? (
                            <div className="p-10 text-center">
                                <span
                                    className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                                <p className="mt-3 text-gray-600 dark:text-gray-400">Đang tải chi tiết...</p>
                            </div>
                        ) : payoutModal.error ? (
                            <div className="p-6 text-center text-red-600 text-sm">{payoutModal.error}</div>
                        ) : payoutModal.data ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
                                <div className="lg:col-span-2 p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <p className="font-semibold text-lg">Host: {payoutModal.data.payout.hostName || payoutModal.data.payout.hostId}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Kỳ: {payoutModal.data.payout.periodStart || '--'} → {payoutModal.data.payout.periodEnd || '--'}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${payoutStatusClass[payoutModal.data.payout.status]}`}>
                      {payoutStatusLabel[payoutModal.data.payout.status]}
                    </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">Số tiền</p>
                                            <p className="font-semibold text-emerald-700">{formatCurrency(Number(payoutModal.data.payout.amountVnd))}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">Approved</p>
                                            <p className="font-semibold">{payoutModal.data.payout.approvedAt ? new Date(payoutModal.data.payout.approvedAt).toLocaleString('vi-VN') : '--'}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">Paid</p>
                                            <p className="font-semibold">{payoutModal.data.payout.paidAt ? new Date(payoutModal.data.payout.paidAt).toLocaleString('vi-VN') : '--'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold">Booking items</h4>
                                            <p className="text-xs text-gray-500">{payoutModal.data.items.length} items</p>
                                        </div>
                                        <div
                                            className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                                            <div className="max-h-64 overflow-y-auto">
                                                <table className="min-w-full text-sm">
                                                    <thead
                                                        className="bg-gray-50 dark:bg-gray-800 text-left text-xs uppercase text-gray-500">
                                                    <tr>
                                                        <th className="px-3 py-2">Booking</th>
                                                        <th className="px-3 py-2">Property</th>
                                                        <th className="px-3 py-2">Due</th>
                                                        <th className="px-3 py-2 text-right">Host net</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {payoutModal.data.items.map((item) => (
                                                        <tr key={item.bookingId}
                                                            className="border-t border-gray-100 dark:border-gray-800">
                                                            <td className="px-3 py-2 font-semibold">#{item.bookingCode}</td>
                                                            <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{item.propertyTitle}</td>
                                                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{new Date(item.dueAt).toLocaleString('vi-VN')}</td>
                                                            <td className="px-3 py-2 text-right font-semibold text-emerald-700">{formatCurrency(item.hostPayoutAmountVnd)}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Mã tham chiếu chuyển khoản
                                            *</label>
                                        <input
                                            type="text"
                                            value={payoutModal.payoutReference}
                                            onChange={(e) => setPayoutModal((m) => ({
                                                ...m,
                                                payoutReference: e.target.value
                                            }))}
                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Nhập mã giao dịch ngân hàng"
                                            disabled={payoutModal.submitting || payoutModal.data.payout.status !== 'PROCESSING'}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Ghi chú admin</label>
                                        <textarea
                                            value={payoutModal.adminNote}
                                            onChange={(e) => setPayoutModal((m) => ({...m, adminNote: e.target.value}))}
                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            rows={3}
                                            placeholder="Ghi chú nội bộ (tuỳ chọn)"
                                            disabled={payoutModal.submitting || payoutModal.data.payout.status !== 'PROCESSING'}
                                        />
                                    </div>

                                    {payoutModal.error && <p className="text-sm text-red-600">{payoutModal.error}</p>}

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => void handleMarkPaid()}
                                            disabled={payoutModal.submitting || payoutModal.data.payout.status !== 'PROCESSING'}
                                            className="w-full px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold disabled:opacity-60"
                                        >
                                            {payoutModal.submitting ? 'Đang lưu...' : 'Đánh dấu đã trả'}
                                        </button>
                                        <button
                                            onClick={closePayoutModal}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 font-semibold"
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettlementsQueuePage;
