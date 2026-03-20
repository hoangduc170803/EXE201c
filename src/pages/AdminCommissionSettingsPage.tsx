import React, { useEffect, useMemo, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/services/api';
import type {
  CommissionAppliesTo,
  CommissionRoundingMode,
  CommissionRuleResponse,
  CommissionType,
  CreateCommissionRuleRequest,
} from '@/services/api';

const COMMISSION_TYPES: { value: CommissionType; label: string }[] = [
  { value: 'PERCENT', label: 'Percent (%)' },
  { value: 'FIXED', label: 'Fixed (VND)' },
  { value: 'PERCENT_PLUS_FIXED', label: 'Percent + Fixed' },
];

const APPLIES_TO: { value: CommissionAppliesTo; label: string }[] = [
  { value: 'TOTAL', label: 'TOTAL (tổng booking)' },
  { value: 'SUBTOTAL', label: 'SUBTOTAL (tiền phòng)' },
];

const ROUNDING: { value: CommissionRoundingMode; label: string }[] = [
  { value: 'ROUND_DOWN', label: 'ROUND_DOWN (làm tròn xuống VND)' },
  { value: 'ROUND_HALF_UP', label: 'ROUND_HALF_UP (0.5 lên)' },
];

function toLocalDateTimeInputValue(date: Date) {
  // yyyy-MM-ddTHH:mm (no seconds)
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
}

const AdminCommissionSettingsPage: React.FC = () => {
  const [rules, setRules] = useState<CommissionRuleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // form
  const [commissionType, setCommissionType] = useState<CommissionType>('PERCENT');
  const [commissionPercent, setCommissionPercent] = useState<string>('6');
  const [commissionFixedVnd, setCommissionFixedVnd] = useState<string>('0');
  const [commissionAppliesTo, setCommissionAppliesTo] = useState<CommissionAppliesTo>('TOTAL');
  const [roundingMode, setRoundingMode] = useState<CommissionRoundingMode>('ROUND_DOWN');
  const [effectiveFrom, setEffectiveFrom] = useState<string>(toLocalDateTimeInputValue(new Date()));
  const [effectiveToEnabled, setEffectiveToEnabled] = useState(false);
  const [effectiveTo, setEffectiveTo] = useState<string>('');

  const activeRule = useMemo(() => rules.find(r => r.isActive), [rules]);

  const loadRules = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.adminListCommissionRules();
      setRules(data);
    } catch (e: any) {
      setError(e?.message || 'Không tải được commission rules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const validateForm = (): string | null => {
    const percent = commissionPercent.trim() === '' ? null : Number(commissionPercent);
    const fixed = commissionFixedVnd.trim() === '' ? null : Number(commissionFixedVnd);

    if (commissionType === 'PERCENT' || commissionType === 'PERCENT_PLUS_FIXED') {
      if (percent === null || Number.isNaN(percent)) return 'commissionPercent không hợp lệ';
      if (percent < 0 || percent > 100) return 'commissionPercent phải trong khoảng 0..100';
    }

    if (commissionType === 'FIXED' || commissionType === 'PERCENT_PLUS_FIXED') {
      if (fixed === null || Number.isNaN(fixed)) return 'commissionFixedVnd không hợp lệ';
      if (fixed < 0) return 'commissionFixedVnd phải >= 0';
    }

    if (!effectiveFrom) return 'effectiveFrom là bắt buộc';
    if (effectiveToEnabled) {
      if (!effectiveTo) return 'effectiveTo đang bật nhưng chưa nhập';
      if (new Date(effectiveTo).getTime() <= new Date(effectiveFrom).getTime()) {
        return 'effectiveTo phải sau effectiveFrom';
      }
    }

    return null;
  };

  const handleCreateRule = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }

    const payload: CreateCommissionRuleRequest = {
      commissionType,
      commissionAppliesTo,
      roundingMode,
      effectiveFrom: new Date(effectiveFrom).toISOString(),
      effectiveTo: effectiveToEnabled && effectiveTo ? new Date(effectiveTo).toISOString() : null,
      commissionPercent:
        commissionType === 'PERCENT' || commissionType === 'PERCENT_PLUS_FIXED'
          ? Number(commissionPercent)
          : null,
      commissionFixedVnd:
        commissionType === 'FIXED' || commissionType === 'PERCENT_PLUS_FIXED' ? Number(commissionFixedVnd) : null,
    };

    try {
      await api.adminCreateCommissionRule(payload);
      setSuccess('Đã tạo rule mới');
      await loadRules();
      setTimeout(() => setSuccess(''), 2500);
    } catch (e: any) {
      setError(e?.message || 'Tạo rule thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (id: number) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.adminActivateCommissionRule(id);
      setSuccess('Đã activate rule');
      await loadRules();
      setTimeout(() => setSuccess(''), 2500);
    } catch (e: any) {
      setError(e?.message || 'Activate thất bại');
    } finally {
      setSaving(false);
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Commission Settings</h1>
          <p className="text-gray-600 mt-2">Cấu hình chính sách commission áp dụng cho booking (lưu lịch sử theo version).</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Active rule quick view */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Rule đang active</h2>
          {activeRule ? (
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <span className="font-medium">Type:</span> {activeRule.commissionType}
              </div>
              <div>
                <span className="font-medium">Percent:</span> {activeRule.commissionPercent ?? '-'}
              </div>
              <div>
                <span className="font-medium">Fixed (VND):</span> {activeRule.commissionFixedVnd ?? '-'}
              </div>
              <div>
                <span className="font-medium">Applies to:</span> {activeRule.commissionAppliesTo}
              </div>
              <div>
                <span className="font-medium">Rounding:</span> {activeRule.roundingMode}
              </div>
              <div>
                <span className="font-medium">Effective from:</span> {new Date(activeRule.effectiveFrom).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Effective to:</span>{' '}
                {activeRule.effectiveTo ? new Date(activeRule.effectiveTo).toLocaleString() : '—'}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Chưa có rule active.</p>
          )}
        </div>

        {/* Create form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tạo rule mới</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={commissionType}
                onChange={e => setCommissionType(e.target.value as CommissionType)}
              >
                {COMMISSION_TYPES.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applies to</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={commissionAppliesTo}
                onChange={e => setCommissionAppliesTo(e.target.value as CommissionAppliesTo)}
              >
                {APPLIES_TO.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {(commissionType === 'PERCENT' || commissionType === 'PERCENT_PLUS_FIXED') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Percent (0..100)</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={commissionPercent}
                  onChange={e => setCommissionPercent(e.target.value)}
                />
              </div>
            )}

            {(commissionType === 'FIXED' || commissionType === 'PERCENT_PLUS_FIXED') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fixed amount (VND)</label>
                <input
                  type="number"
                  step="1"
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={commissionFixedVnd}
                  onChange={e => setCommissionFixedVnd(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rounding mode</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={roundingMode}
                onChange={e => setRoundingMode(e.target.value as CommissionRoundingMode)}
              >
                {ROUNDING.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effective from</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={effectiveFrom}
                onChange={e => setEffectiveFrom(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={effectiveToEnabled}
                  onChange={e => setEffectiveToEnabled(e.target.checked)}
                />
                Có effectiveTo
              </label>
              {effectiveToEnabled && (
                <div className="mt-2 max-w-sm">
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={effectiveTo}
                    onChange={e => setEffectiveTo(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              disabled={saving}
              onClick={handleCreateRule}
              className={`px-5 py-2.5 rounded-lg text-white font-medium ${
                saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {saving ? 'Đang lưu...' : 'Tạo rule'}
            </button>
          </div>
        </div>

        {/* History table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Lịch sử rules</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-3 pr-4">Version</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Percent</th>
                  <th className="py-3 pr-4">Fixed</th>
                  <th className="py-3 pr-4">AppliesTo</th>
                  <th className="py-3 pr-4">Rounding</th>
                  <th className="py-3 pr-4">Effective</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.length === 0 && (
                  <tr>
                    <td className="py-6 text-gray-500" colSpan={9}>
                      Chưa có rule nào.
                    </td>
                  </tr>
                )}
                {rules.map(r => (
                  <tr key={r.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-4 font-medium">{r.version}</td>
                    <td className="py-3 pr-4">{r.commissionType}</td>
                    <td className="py-3 pr-4">{r.commissionPercent ?? '-'}</td>
                    <td className="py-3 pr-4">{r.commissionFixedVnd ?? '-'}</td>
                    <td className="py-3 pr-4">{r.commissionAppliesTo}</td>
                    <td className="py-3 pr-4">{r.roundingMode}</td>
                    <td className="py-3 pr-4">
                      <div>{new Date(r.effectiveFrom).toLocaleString()}</div>
                      <div className="text-gray-500">{r.effectiveTo ? new Date(r.effectiveTo).toLocaleString() : '—'}</div>
                    </td>
                    <td className="py-3 pr-4">
                      {r.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        disabled={saving || r.isActive}
                        onClick={() => handleActivate(r.id)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                          r.isActive
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-rose-200 text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        Activate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCommissionSettingsPage;

