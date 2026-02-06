import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { UserProfile, BookingItem, userResponseToProfile, bookingResponseToItem } from '@/types';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getUserProfile();
      if (response.success && response.data) {
        const userProfile = userResponseToProfile(response.data);
        setProfile(userProfile);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user bookings
  const fetchBookings = async () => {
    try {
      const response = await api.getMyBookings(0, 10);
      if (response.success && response.data) {
        const bookingItems = response.data.content.map(bookingResponseToItem);
        setBookings(bookingItems);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      // Don't set error for bookings as it's less critical
    }
  };

  // Update profile
  const updateProfile = async (updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
  }) => {
    try {
      setUpdating(true);
      setError(null);

      const response = await api.updateUserProfile(updates);
      if (response.success && response.data) {
        const updatedProfile = userResponseToProfile(response.data);
        setProfile(updatedProfile);
        return true;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Không thể cập nhật thông tin hồ sơ');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (api.isAuthenticated()) {
      fetchProfile();
      fetchBookings();
    } else {
      setLoading(false);
      setError('Bạn cần đăng nhập để xem trang này');
    }
  }, []);

  return {
    profile,
    bookings,
    loading,
    error,
    updating,
    updateProfile,
    refetch: () => {
      fetchProfile();
      fetchBookings();
    }
  };
};
