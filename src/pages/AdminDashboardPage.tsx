import React, { useState, useEffect } from 'react';
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

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'users'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
    loadProperties();
    loadUsers();
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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.content || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-rose-500" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Quản lý toàn bộ hệ thống</p>
          </div>
          <a
            href="/admin/payment-settings"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Cài đặt Thanh toán</span>
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'properties'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Quản lý tin đăng
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Quản lý Users
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Users Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng Users</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <div className="mt-4 flex gap-4 text-sm">
                <span className="text-gray-600">Hosts: {stats.totalHosts}</span>
                <span className="text-gray-600">Guests: {stats.totalGuests}</span>
              </div>
            </div>

            {/* Properties Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng Properties</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
              <div className="mt-4 flex gap-2 text-sm">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                  Active: {stats.activeProperties}
                </span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                  Pending: {stats.pendingProperties}
                </span>
              </div>
            </div>

            {/* Revenue Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Tổng Doanh thu</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-gray-500 mt-2">
                Transactions: {stats.totalTransactions}
              </p>
            </div>

            {/* Subscriptions Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Subscriptions</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
              <div className="mt-4 flex gap-2 text-sm">
                <span className="text-gray-600">Expired: {stats.expiredSubscriptions}</span>
                <span className="text-gray-600">Pending: {stats.pendingSubscriptions}</span>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Danh sách tin đăng</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tin đăng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Host</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gói</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{property.title}</p>
                          <p className="text-sm text-gray-500">{property.city}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">{property.viewCount} views</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{property.hostName}</p>
                        <p className="text-xs text-gray-500">{property.hostEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {property.pricePerNight
                            ? formatCurrency(property.pricePerNight) + '/đêm'
                            : formatCurrency(property.pricePerMonth || 0) + '/tháng'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {property.currentPackage || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            property.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : property.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
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
                              className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              title="Duyệt"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectProperty(property.id)}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              title="Từ chối"
                            >
                              <X className="w-4 h-4" />
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Danh sách Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Properties</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium"
                            >
                              {role.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{user.totalProperties} tin đăng</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(user.walletBalance)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleUserActive(user.id)}
                          className={`p-2 rounded hover:opacity-80 ${
                            user.isActive
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                          }`}
                          title={user.isActive ? 'Block' : 'Unblock'}
                        >
                          {user.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

