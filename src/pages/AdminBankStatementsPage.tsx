import React, {useEffect, useMemo, useState} from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import {api, type BankStatementImportResponse, type BankStatementLineDto, type BankStatementSessionResponse, type PageResponse} from '@/services/api';

const formatCurrency = (value?: number | null) =>
    new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(value ?? 0);

const AdminBankStatementsPage: React.FC = () => {
    const [sessionsPage, setSessionsPage] = useState<PageResponse<BankStatementSessionResponse> | null>(null);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [sessionsError, setSessionsError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [selectedSession, setSelectedSession] = useState<BankStatementImportResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [lineBusy, setLineBusy] = useState<Record<number, boolean>>({});
    const [bookingOverrides, setBookingOverrides] = useState<Record<number, string>>({});
    const [lineNotes, setLineNotes] = useState<Record<number, string>>({});
    const [pageMessage, setPageMessage] = useState('');

    const loadSessions = async () => {
        try {
            setSessionsLoading(true);
            setSessionsError('');
            const response = await api.adminListBankStatementSessions();
            setSessionsPage(response.data);
        } catch (err: any) {
            setSessionsError(err?.message || 'Không tải được danh sách session');
        } finally {
            setSessionsLoading(false);
        }
    };

    const loadSessionDetail = async (sessionId: number) => {
        try {
            setDetailLoading(true);
            const response = await api.adminGetBankStatementSession(sessionId);
            setSelectedSession(response.data);
            setBookingOverrides(() => {
                const next: Record<number, string> = {};
                response.data.lines.forEach((line) => {
                    if (line.lineId) {
                        next[line.lineId] = line.matchedBookingCode || '';
                    }
                });
                return next;
            });
            setLineNotes({});
        } catch (err: any) {
            setPageMessage(err?.message || 'Không tải được chi tiết session');
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        void loadSessions();
    }, []);

    const handleUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        setUploadError('');
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            setUploadError('Vui lòng chọn file Excel (.xlsx/.xls)');
            return;
        }
        try {
            setUploading(true);
            const response = await api.adminUploadBankStatement(file, 200);
            setPageMessage('Đã parse file, kiểm tra preview bên dưới.');
            setSelectedSession(response.data);
            setBookingOverrides(() => {
                const next: Record<number, string> = {};
                response.data.lines.forEach((line) => {
                    if (line.lineId) next[line.lineId] = line.matchedBookingCode || '';
                });
                return next;
            });
            setLineNotes({});
            await loadSessions();
        } catch (err: any) {
            setUploadError(err?.message || 'Upload thất bại');
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    };

    const updateLineState = (updatedLine: BankStatementLineDto) => {
        setSelectedSession((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                lines: prev.lines.map((line) => (line.lineId === updatedLine.lineId ? updatedLine : line)),
                confirmedLines:
                    updatedLine.status === 'CONFIRMED'
                        ? prev.confirmedLines + 1
                        : prev.confirmedLines,
            };
        });
    };

    const handleConfirmLine = async (line: BankStatementLineDto) => {
        if (!selectedSession) return;
        const overrideCode = bookingOverrides[line.lineId] || line.matchedBookingCode;
        if (!line.matchedBookingId && (!overrideCode || overrideCode.trim().length === 0)) {
            setPageMessage('Nhập booking code để xác nhận dòng chưa tự match.');
            return;
        }
        try {
            setLineBusy((prev) => ({...prev, [line.lineId]: true}));
            setPageMessage('');
            const payload = {
                bookingId: line.matchedBookingId,
                bookingCode: overrideCode,
                note: lineNotes[line.lineId],
            };
            const response = await api.adminConfirmBankStatementLine(selectedSession.sessionId, line.lineId, payload);
            updateLineState(response.data);
            await loadSessions();
            setPageMessage('Đã xác nhận và mark booking đã thanh toán.');
        } catch (err: any) {
            setPageMessage(err?.message || 'Không thể xác nhận dòng');
        } finally {
            setLineBusy((prev) => ({...prev, [line.lineId]: false}));
        }
    };

    const handleRejectLine = async (line: BankStatementLineDto) => {
        if (!selectedSession) return;
        const note = lineNotes[line.lineId];
        if (!note || note.trim().length === 0) {
            setPageMessage('Vui lòng nhập ghi chú khi reject.');
            return;
        }
        try {
            setLineBusy((prev) => ({...prev, [  line.lineId]: true}));
            const response = await api.adminRejectBankStatementLine(selectedSession.sessionId, line.lineId, note);
            updateLineState(response.data);
            setPageMessage('Đã reject dòng.');
        } catch (err: any) {
            setPageMessage(err?.message || 'Không thể reject dòng');
        } finally {
            setLineBusy((prev) => ({...prev, [line.lineId]: false}));
        }
    };

    const sessionSummary = useMemo(() => {
        if (!selectedSession) return null;
        return {
            total: selectedSession.totalRows,
            parsed: selectedSession.parsedLines,
            matched: selectedSession.matchedLines,
            confirmed: selectedSession.confirmedLines,
        };
    }, [selectedSession]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <AdminHeader/>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Bank Statement Import</h1>
                    <p className="text-sm text-gray-600">
                        Upload sao kê Vietcombank, hệ thống sẽ parse và tự match booking dựa trên bookingCode + số tiền.
                        Sau đó admin confirm để đánh dấu booking đã thanh toán và sinh settlement.
                    </p>
                </div>

                {pageMessage && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-md text-sm">
                        {pageMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">Upload Vietcombank Excel</h2>
                            <p className="text-sm text-gray-500">Chấp nhận .xlsx, tối đa 5MB.</p>
                        </div>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Chọn file</span>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleUploadChange}
                                disabled={uploading}
                                className="mt-2 block w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                            />
                        </label>
                        {uploading && <p className="text-sm text-blue-600">Đang tải và parse...</p>}
                        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 lg:col-span-2">
                        <h2 className="text-lg font-semibold">Session gần đây</h2>
                        {sessionsLoading ? (
                            <p className="text-sm text-gray-500">Đang tải...</p>
                        ) : sessionsError ? (
                            <p className="text-sm text-red-600">{sessionsError}</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                    <tr className="text-left text-xs text-gray-500 uppercase">
                                        <th className="px-3 py-2">Session</th>
                                        <th className="px-3 py-2">File</th>
                                        <th className="px-3 py-2">Matched</th>
                                        <th className="px-3 py-2">Confirmed</th>
                                        <th className="px-3 py-2">Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sessionsPage?.content.map((session) => (
                                        <tr key={session.id} className="border-t border-gray-100">
                                            <td className="px-3 py-2 font-semibold">#{session.id}</td>
                                            <td className="px-3 py-2">
                                                <p className="text-sm">{session.filename}</p>
                                                <p className="text-xs text-gray-500">{session.createdAt ? new Date(session.createdAt).toLocaleString('vi-VN') : '--'}</p>
                                            </td>
                                            <td className="px-3 py-2">{session.matchedLines ?? 0}</td>
                                            <td className="px-3 py-2">{session.confirmedLines ?? 0}</td>
                                            <td className="px-3 py-2">
                                                <button
                                                    className="text-sm px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                                                    onClick={() => void loadSessionDetail(session.id)}
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {sessionsPage?.content.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-3 text-sm text-gray-500" colSpan={5}>Chưa có session nào</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold">Chi tiết session</h2>
                            {selectedSession && (
                                <span className="text-sm text-gray-500">#{selectedSession.sessionId}</span>
                            )}
                        </div>
                        {detailLoading && <p className="text-sm text-gray-500">Đang tải chi tiết session...</p>}
                        {!selectedSession && !detailLoading && (
                            <p className="text-sm text-gray-500">Chọn session hoặc upload file để xem preview.</p>
                        )}
                    </div>

                    {selectedSession && sessionSummary && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {[
                                {label: 'Total rows', value: sessionSummary.total},
                                {label: 'Parsed', value: sessionSummary.parsed},
                                {label: 'Auto matched', value: sessionSummary.matched},
                                {label: 'Confirmed', value: sessionSummary.confirmed},
                            ].map((item) => (
                                <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 uppercase">{item.label}</p>
                                    <p className="text-lg font-semibold">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedSession && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="text-xs text-gray-500 uppercase">
                                <tr className="border-b border-gray-100">
                                    <th className="px-3 py-2">Row</th>
                                    <th className="px-3 py-2">Ngày</th>
                                    <th className="px-3 py-2">Mô tả</th>
                                    <th className="px-3 py-2">Ghi có</th>
                                    <th className="px-3 py-2">Booking code</th>
                                    <th className="px-3 py-2">Trạng thái</th>
                                    <th className="px-3 py-2">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedSession.lines.map((line) => {
                                    const disabled = line.status === 'CONFIRMED';
                                    const busy = lineBusy[line.lineId];
                                    return (
                                        <tr key={line.lineId} className="border-b border-gray-100 align-top">
                                            <td className="px-3 py-2 font-semibold">{line.rowNumber}</td>
                                            <td className="px-3 py-2 text-sm text-gray-600">
                                                {line.transactionDate ? new Date(line.transactionDate).toLocaleDateString('vi-VN') : '--'}
                                            </td>
                                            <td className="px-3 py-2">
                                                <p className="font-medium text-gray-900">{line.description}</p>
                                                {line.note && <p className="text-xs text-gray-500">{line.note}</p>}
                                            </td>
                                            <td className="px-3 py-2 font-semibold text-emerald-700">{formatCurrency(line.amountIn)}</td>
                                            <td className="px-3 py-2">
                                                <input
                                                    type="text"
                                                    value={bookingOverrides[line.lineId] ?? ''}
                                                    onChange={(e) =>
                                                        setBookingOverrides((prev) => ({...prev, [line.lineId]: e.target.value}))
                                                    }
                                                    className="w-full rounded-lg border border-gray-200 px-2 py-1 text-sm"
                                                    placeholder="BKXXXX"
                                                    disabled={disabled}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Auto: {line.matchedBookingCode || (line.extractedBookingCode ?? '--')}
                                                </p>
                                            </td>
                                            <td className="px-3 py-2">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                                        line.status === 'CONFIRMED'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : line.status === 'AUTO_MATCHED'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : line.status === 'REJECTED'
                                                                    ? 'bg-rose-100 text-rose-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {line.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="space-y-2">
                                                    <textarea
                                                        rows={2}
                                                        className="w-full rounded-lg border border-gray-200 px-2 py-1 text-xs"
                                                        placeholder="Ghi chú nội bộ"
                                                        value={lineNotes[line.lineId] ?? ''}
                                                        onChange={(e) =>
                                                            setLineNotes((prev) => ({...prev, [line.lineId]: e.target.value}))
                                                        }
                                                        disabled={disabled}
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold disabled:opacity-50"
                                                            onClick={() => void handleConfirmLine(line)}
                                                            disabled={disabled || busy}
                                                        >
                                                            {busy ? 'Đang xử lý...' : 'Confirm' }
                                                        </button>
                                                        <button
                                                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold disabled:opacity-50"
                                                            onClick={() => void handleRejectLine(line)}
                                                            disabled={disabled || busy}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBankStatementsPage;

