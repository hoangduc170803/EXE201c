import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import {
    LayoutDashboard,
    Users,
    Home,
    DollarSign,
    TrendingUp,
    Eye,
    Check,
    X,
    Ban,
    CheckCircle,
    Wallet,
    Clock,
    AlertCircle,
    ImageIcon,
    FileSpreadsheet,
} from 'lucide-react';

interface DashboardStats {
    totalUsers: number;
    totalHosts: number;
    totalGuests: number;
    newUsersThisMonth: number;
    totalProperties: number;
    activeProperties: number;
    pendingProperties: number;
    newPropertiesThisMonth: number;
    totalRevenue: number;
    monthlyRevenue: number;
    pendingPayments: number;
    totalTransactions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    pendingSubscriptions: number;
    todayBookings: number;
    todayTransactions: number;
}

interface Property {
    id: number;
    title: string;
    propertyType: string;
    rentalType: string;
    address: string;
    city: string;
    pricePerNight?: number;
    pricePerMonth?: number;
    status: string;
    hostId: number;
    hostName: string;
    hostEmail: string;
    currentPackage?: string;
    subscriptionEndDate?: string;
    viewCount: number;
    totalReviews: number;
    averageRating?: number;
    createdAt: string;
}

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    city?: string;
    country?: string;
    isActive: boolean;
    roles: string[];
    totalProperties: number;
    walletBalance: number;
    createdAt: string;
}

interface DepositTransaction {
    id: number;
    userId: number;
    userName: string;
    amount: number;
    transactionType: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    description: string;
    paymentMethod: string;
    transactionCode: string;
    balanceBefore: number;
    balanceAfter: number;
    notes?: string;
    transferReference?: string;
    proofImageUrl?: string;
    createdAt: string;
}

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [deposits, setDeposits] = useState<DepositTransaction[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'users' | 'deposits'>('overview');
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingCode, setRejectingCode] = useState<string | null>(null);
    const [viewProofImage, setViewProofImage] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardStats();
        loadProperties();
        loadUsers();
        loadDeposits();
    }, []);

    const loadDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/admin/dashboard/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadProperties = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/admin/properties?page=0&size=20', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProperties(data.content || []);
            }
        } catch (error) {
            console.error('Failed to load properties:', error);
        }
    };

    const loadUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/admin/users?page=0&size=20', {
                headers: {'Authorization': `Bearer ${token}`},
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data.content || []);
            }
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    const loadDeposits = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/admin/transactions/pending-deposits?page=0&size=50', {
                headers: {'Authorization': `Bearer ${token}`},
            });
            if (response.ok) {
                const data = await response.json();
                setDeposits(data.content || []);
            }
        } catch (error) {
            console.error('Failed to load deposits:', error);
        }
    };

    const handleConfirmDeposit = async (transactionCode: string) => {
        if (!confirm(`Xác nhận nạp tiền cho giao dịch ${transactionCode}?`)) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/admin/transactions/confirm-deposit/${transactionCode}`, {
                method: 'PUT',
                headers: {'Authorization': `Bearer ${token}`},
            });
            if (response.ok) {
                alert('✅ Đã xác nhận nạp tiền thành công!');
                loadDeposits();
                loadDashboardStats();
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Failed to confirm deposit:', error);
        }
    };

    const handleRejectDeposit = async (transactionCode: string) => {
        const reason = rejectReason.trim() || 'Không hợp lệ';
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/admin/transactions/reject-deposit/${transactionCode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reason),
            });
            if (response.ok) {
                alert('❌ Đã từ chối giao dịch!');
                setRejectingCode(null);
                setRejectReason('');
                loadDeposits();
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Failed to reject deposit:', error);
        }
    };

    const handleApproveProperty = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/admin/properties/${id}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert('Đã duyệt tin đăng!');
                loadProperties();
                loadDashboardStats();
            }
        } catch (error) {
            console.error('Failed to approve property:', error);
        }
    };

    const handleRejectProperty = async (id: number) => {
        const reason = prompt('Lý do từ chối:');
        if (!reason) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/admin/properties/${id}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reason),
            });
            if (response.ok) {
                alert('Đã từ chối tin đăng!');
                loadProperties();
                loadDashboardStats();
            }
        } catch (error) {
            console.error('Failed to reject property:', error);
        }
    };

    const handleToggleUserActive = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/admin/users/${id}/toggle-active`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                alert('Đã cập nhật trạng thái user!');
                loadUsers();
            }
        } catch (error) {
            console.error('Failed to toggle user:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <AdminHeader/>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <LayoutDashboard className="w-8 h-8 text-primary"/>
                            Tổng quan
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Chào mừng trở lại, {localStorage.getItem('email')}!
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'overview'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            >
                                Tổng quan
                            </button>
                            <button
                                onClick={() => setActiveTab('properties')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'properties'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            >
                                Quản lý tin đăng
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === 'users'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            >
                                Quản lý người dùng
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('deposits');
                                    loadDeposits();
                                }}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                                    activeTab === 'deposits'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                            >
                                Quản lý Nạp tiền
                                {deposits.length > 0 && (
                                    <span
                                        className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-rose-500 rounded-full">
                    {deposits.length}
                  </span>
                                )}
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Users Stats */}
                            <div
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-gray-800 dark:text-white">Người dùng</h3>
                                    <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                                <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
                                    <TrendingUp className="w-4 h-4 mr-1"/>
                                    <span>+{stats.newUsersThisMonth} tháng này</span>
                                </div>
                            </div>

                            {/* Properties Stats */}
                            <div
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-gray-800 dark:text-white">Tin đăng</h3>
                                    <div className="p-2.5 bg-green-100 dark:bg-green-500/20 rounded-lg">
                                        <Home className="w-6 h-6 text-green-600 dark:text-green-400"/>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalProperties}</p>
                                <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
                                    <TrendingUp className="w-4 h-4 mr-1"/>
                                    <span>+{stats.newPropertiesThisMonth} tháng này</span>
                                </div>
                            </div>

                            {/* Revenue Stats */}
                            <div
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-gray-800 dark:text-white">Doanh thu</h3>
                                    <div className="p-2.5 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400"/>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalRevenue)}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                                    {stats.totalTransactions} giao dịch
                                </p>
                            </div>

                            {/* Subscriptions Stats */}
                            <div
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-gray-800 dark:text-white">Gói đăng ký</h3>
                                    <div className="p-2.5 bg-orange-100 dark:bg-orange-500/20 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400"/>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeSubscriptions}</p>
                                <div className="mt-3 flex gap-2 text-sm">
                                    <span
                                        className="text-yellow-600 dark:text-yellow-400">Chờ: {stats.pendingSubscriptions}</span>
                                    <span
                                        className="text-red-600 dark:text-red-400">Hết hạn: {stats.expiredSubscriptions}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                to="/admin/settlements"
                                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/40 hover:shadow-soft transition"
                            >
                                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Payout queue</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">Quản lý Settlements</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Theo dõi gross / commission / net từng booking</p>
                                </div>
                            </Link>

                            <Link
                                to="/admin/bank-statements"
                                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/40 hover:shadow-soft transition"
                            >
                                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                                    <FileSpreadsheet className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Reconciliation</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">Import Bank Statement</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Tải Excel Vietcombank, match & confirm thanh toán</p>
                                </div>
                            </Link>
                        </div>
                    </>
                )}

                {/* Properties Tab */}
                {activeTab === 'properties' && (
                    <div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quản lý tin đăng</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tin
                                        đăng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chủ
                                        nhà
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giá</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gói</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng
                                        thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hành
                                        động
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {properties.map((property) => (
                                    <tr key={property.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{property.title}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{property.city}</p>
                                                <div
                                                    className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400">
                                                    <Eye className="w-4 h-4"/>
                                                    <span className="text-xs">{property.viewCount} lượt xem</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{property.hostName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{property.hostEmail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {property.pricePerNight
                                                    ? formatCurrency(property.pricePerNight) + '/đêm'
                                                    : formatCurrency(property.pricePerMonth || 0) + '/tháng'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                        <span
                            className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 rounded-full text-xs font-medium">
                          {property.currentPackage || 'Chưa có'}
                        </span>
                                        </td>
                                        <td className="px-6 py-4">
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                property.status === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300'
                                    : property.status === 'PENDING'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                            }`}
                        >
                          {property.status}
                        </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {property.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApproveProperty(property.id)}
                                                        className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 dark:bg-green-500/20 dark:text-green-300 dark:hover:bg-green-500/30 transition-colors"
                                                        title="Duyệt"
                                                    >
                                                        <Check className="w-4 h-4"/>
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectProperty(property.id)}
                                                        className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30 transition-colors"
                                                        title="Từ chối"
                                                    >
                                                        <X className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quản lý người dùng</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Người
                                        dùng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vai
                                        trò
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tin
                                        đăng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số
                                        dư ví
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trạng
                                        thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hành
                                        động
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role) => (
                                                    <span
                                                        key={role}
                                                        className="px-2.5 py-1 bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 rounded-full text-xs font-medium"
                                                    >
                              {role.replace('ROLE_', '')}
                            </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900 dark:text-gray-300">{user.totalProperties} tin</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(user.walletBalance)}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                user.isActive
                                    ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'
                            }`}
                        >
                          <span
                              className={`w-2 h-2 mr-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {user.isActive ? 'Hoạt động' : 'Bị chặn'}
                        </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleUserActive(user.id)}
                                                className={`p-2 rounded-md transition-colors ${
                                                    user.isActive
                                                        ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30'
                                                        : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-300 dark:hover:bg-green-500/30'
                                                }`}
                                                title={user.isActive ? 'Chặn người dùng' : 'Bỏ chặn người dùng'}
                                            >
                                                {user.isActive ? <Ban className="w-4 h-4"/> :
                                                    <CheckCircle className="w-4 h-4"/>}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* Deposits Tab */}
                {activeTab === 'deposits' && (
                    <div className="space-y-4">
                        <div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div
                                className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Wallet className="w-6 h-6 text-emerald-500"/>
                                        Yêu cầu Nạp tiền chờ xác nhận
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Xác nhận sau khi kiểm tra chuyển khoản thực tế từ host
                                    </p>
                                </div>
                                <div
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg">
                                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400"/>
                                    <span
                                        className="text-sm font-semibold text-amber-700 dark:text-amber-400">{deposits.length} chờ xử lý</span>
                                </div>
                            </div>

                            {deposits.length === 0 ? (
                                <div className="p-16 text-center">
                                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3"/>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">Không có yêu cầu nào
                                        đang chờ xử lý</p>
                                    <p className="text-sm text-gray-400 mt-1">Tất cả giao dịch đã được xử lý</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thời
                                                gian
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Host</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số
                                                tiền
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phương
                                                thức
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mã
                                                giao dịch
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bằng
                                                chứng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Hành
                                                động
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {deposits.map((deposit) => (
                                            <tr key={deposit.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                    {new Date(deposit.createdAt).toLocaleString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900 dark:text-white">{deposit.userName}</p>
                                                    <p className="text-xs text-gray-400">ID: {deposit.userId}</p>
                                                </td>
                                                <td className="px-6 py-4">
                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              +{formatCurrency(deposit.amount)}
                            </span>
                                                </td>
                                                <td className="px-6 py-4">
                            <span
                                className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 rounded-full text-xs font-medium">
                              {deposit.paymentMethod === 'BANK_TRANSFER' ? '🏦 Chuyển khoản' :
                                  deposit.paymentMethod === 'MOMO' ? '📱 MoMo' :
                                      deposit.paymentMethod === 'VNPAY' ? '💳 VNPay' : deposit.paymentMethod}
                            </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <code
                                                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded font-mono">
                                                        {deposit.transactionCode}
                                                    </code>
                                                </td>
                                                {/* Proof column */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                                                        {deposit.transferReference ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-xs text-gray-400">Mã TK:</span>
                                                                <code
                                                                    className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-mono font-semibold">
                                                                    {deposit.transferReference}
                                                                </code>
                                                            </div>
                                                        ) : null}
                                                        {deposit.proofImageUrl ? (
                                                            <button
                                                                onClick={() => setViewProofImage(
                                                                    deposit.proofImageUrl!.startsWith('http')
                                                                        ? deposit.proofImageUrl!
                                                                        : `http://localhost:8080${deposit.proofImageUrl}`
                                                                )}
                                                                className="flex items-center gap-1.5 group"
                                                                title="Xem ảnh biên lai"
                                                            >
                                                                <div
                                                                    className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 group-hover:border-rose-400 transition-colors">
                                                                    <img
                                                                        src={deposit.proofImageUrl.startsWith('http') ? deposit.proofImageUrl : `http://localhost:8080${deposit.proofImageUrl}`}
                                                                        alt="Biên lai"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    <div
                                                                        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all">
                                                                        <Eye
                                                                            className="w-4 h-4 text-white opacity-0 group-hover:opacity-100"/>
                                                                    </div>
                                                                </div>
                                                                <span
                                                                    className="text-xs text-rose-500 group-hover:text-rose-700 font-medium">Xem biên lai</span>
                                                            </button>
                                                        ) : null}
                                                        {!deposit.transferReference && !deposit.proofImageUrl && (
                                                            <div className="flex items-center gap-1.5">
                                                                <ImageIcon className="w-4 h-4 text-gray-300"/>
                                                                <span className="text-xs text-gray-400 italic">Chưa có bằng chứng</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {rejectingCode === deposit.transactionCode ? (
                                                        <div className="flex flex-col gap-2 min-w-[220px]">
                                                            <input
                                                                type="text"
                                                                value={rejectReason}
                                                                onChange={(e) => setRejectReason(e.target.value)}
                                                                placeholder="Lý do từ chối..."
                                                                className="text-xs px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleRejectDeposit(deposit.transactionCode)}
                                                                    className="flex-1 px-2 py-1 bg-rose-500 text-white text-xs rounded-lg hover:bg-rose-600 font-medium"
                                                                >
                                                                    Xác nhận từ chối
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setRejectingCode(null);
                                                                        setRejectReason('');
                                                                    }}
                                                                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-300"
                                                                >
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleConfirmDeposit(deposit.transactionCode)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                                                            >
                                                                <Check className="w-3.5 h-3.5"/>
                                                                Xác nhận
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setRejectingCode(deposit.transactionCode);
                                                                    setRejectReason('');
                                                                }}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 text-xs rounded-lg hover:bg-rose-200 transition-colors font-medium"
                                                            >
                                                                <X className="w-3.5 h-3.5"/>
                                                                Từ chối
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Info box */}
                        <div
                            className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"/>
                            <div className="text-sm text-amber-800 dark:text-amber-300">
                                <p className="font-semibold mb-1">Hướng dẫn xử lý:</p>
                                <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-400">
                                    <li>Kiểm tra <strong>Mã tham chiếu</strong> và <strong>Ảnh biên lai</strong> trong
                                        cột "Bằng chứng"
                                    </li>
                                    <li>Đối chiếu với lịch sử giao dịch ngân hàng theo <strong>Mã giao dịch</strong>
                                    </li>
                                    <li>Nếu đã nhận được tiền → nhấn <strong>Xác nhận</strong> để cộng tiền vào ví host
                                    </li>
                                    <li>Nếu chưa nhận hoặc sai số tiền → nhấn <strong>Từ chối</strong> kèm lý do</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {viewProofImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={() => setViewProofImage(null)}
                >
                    <button
                        onClick={() => setViewProofImage(null)}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                    >
                        <X className="w-6 h-6"/>
                    </button>
                    <div className="text-center" onClick={(e) => e.stopPropagation()}>
                        <p className="text-white text-sm font-medium mb-3 opacity-70">Ảnh biên lai chuyển khoản</p>
                        <img
                            src={viewProofImage}
                            alt="Biên lai chuyển khoản"
                            className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                        />
                        <p className="text-white/50 text-xs mt-3">Nhấn bên ngoài hoặc X để đóng</p>
                    </div>
                </div>
            )
            };
        </div>


    );

};
export default AdminDashboardPage;

