import React from 'react';

// Home Page Types (Updated from staynext(1))
export interface Listing {
  id: string;
  image: string;
  location: string;
  details: string;
  dates: string;
  rating: number;
  price: number;
  isGuestFavorite?: boolean;
}

export interface Category {
  id: string;
  icon: string;
  label: string;
}

export interface MapMarker {
  id: string;
  price: number;
  top: string;
  left: string;
  isActive?: boolean;
}

// Legacy Property type (for backward compatibility)
export interface Property {
  id: string;
  location: string;
  details: string;
  dates: string;
  rating: number;
  price: number;
  imageUrl: string;
  isGuestFavorite: boolean;
}

// Auth Types
export enum AuthMode {
  LOGIN = 'Log In',
  SIGNUP = 'Sign Up'
}

export interface NavLink {
  label: string;
  href: string;
}

// Profile Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface StatItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  iconColorClass: string;
  iconBgClass: string;
}

export interface FavoriteItem {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  rating: number;
}

export interface BookingItem {
  id: number;
  image: string;
  name: string;
  location: string;
  dateRange: string;
  duration: string;
  status: 'completed' | 'upcoming';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  avatar: string;
  joinedYear: number;
  isVerified: boolean;
}

// Host Portal Types
export type PropertyStatus = 'Active' | 'Draft' | 'Archived';

export interface HostProperty {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  status: PropertyStatus;
  price?: number;
  currency: string;
  rating?: number;
  upcomingBookings?: number;
  views?: number;
  isPriceSet: boolean;
}

export interface HostUser {
  name: string;
  avatarUrl: string;
  role: string;
}

export type TabType = 'All Listings' | 'Active' | 'Draft' | 'Archived';

// Reservation Types (from myhost-quanlydatcho)
export interface Guest {
  name: string;
  avatar: string | null;
  initials?: string;
  type: 'Khách mới' | 'Khách quen' | 'Quốc tế';
  isVip?: boolean;
  message?: string;
}

export interface Reservation {
  id: string;
  guest: Guest;
  property: string;
  checkIn: {
    dayOfWeek: string;
    dayOfMonth: string;
  };
  checkOut: {
    dayOfWeek: string;
    dayOfMonth: string;
  };
  details: string;
  price: string;
  priceNote: string;
  status: 'Chờ xác nhận' | 'Đã xác nhận' | 'Đã hủy';
}

export interface Message {
  id: string;
  sender: string;
  avatar: string | null;
  initials?: string;
  content: string;
  time: string;
  unread?: boolean;
  online?: boolean;
}

// Chat/Message Types
export interface ChatUser {
  id: string;
  name: string;
  avatarUrl: string;
  isCurrentUser: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'system' | 'image';
  imageUrl?: string;
  systemMeta?: {
    title: string;
    description: string;
    actionText?: string;
    icon?: 'check' | 'info';
  };
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  partner: ChatUser;
  propertyName: string;
  propertyDates: string;
  propertyImageUrl: string;
  status: 'Confirmed' | 'Inquiry' | 'Past Trip';
  messages: ChatMessage[];
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  isOnline?: boolean;
}
