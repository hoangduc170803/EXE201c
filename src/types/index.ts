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
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' ;
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

// Helper function to convert API UserResponse to UserProfile
export const userResponseToProfile = (user: any): UserProfile => ({
  name: user.fullName || `${user.firstName} ${user.lastName}`,
  email: user.email,
  phone: user.phone || '',
  dob: user.dateOfBirth || '',
  address: user.address || '',
  avatar: user.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8KCeimPBwiW5F2w3hGxukT7pB2VTKvDHMJFM9qPmkmKobkh1SmpVn3ODHq87gxjsGvV_T8N8G-hkvY1guE6Rv-GvWitU6fUWJPV9IgBUnW8xZwu8pqFwybfIvgnyJQi-gp1frB1A5Veg5fzo8ygxewUlSrPG2W6t5lLF-x0u-LpYyTfSz4kf92uJFHz51WkINxzQzmPg_YotvNqzobZ0DsLnToJjnopVu3crG-g-B_Nr6qlIBeNzEE7DqPuy2QnWG66uTJrfyj6U',
  joinedYear: user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear(),
  isVerified: user.isVerified || false
});

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

// Property Filter Types
export interface PropertyFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: 'ENTIRE_PLACE' | 'PRIVATE_ROOM' | 'SHARED_ROOM';
  amenityIds?: number[];
  city?: string;
  isInstantBook?: boolean;
  freeCancellation?: boolean;
  minGuests?: number;
  checkIn?: string;
  checkOut?: string;
}

export interface GuestCount {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface SearchCriteria {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: GuestCount;
}

export interface MapMarkerData {
  id: string;
  price: number;
  lat: number;
  lng: number;
  isActive?: boolean;
}

export interface FilterDropdownProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
  hasActiveFilters?: boolean;
}

// Booking Types
export interface CreateBookingRequest {
  propertyId: number;
  checkInDate: string;
  checkOutDate: string;
  numGuests: number;
  numAdults: number;
  numChildren: number;
  numInfants: number;
  specialRequests?: string;
  guestMessage?: string;
}

export interface BookingResponse {
  id: number;
  bookingCode: string;
  checkInDate: string;
  checkOutDate: string;
  numGuests: number;
  numAdults: number;
  numChildren: number;
  numInfants: number;
  pricePerNight: number;
  numNights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxAmount: number;
  discountAmount: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  paymentMethod?: string;
  specialRequests?: string;
  guestMessage?: string;
  hostResponse?: string;
  guest: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  property: {
    id: number;
    title: string;
    address: string;
    city: string;
    country: string;
    primaryImageUrl: string;
    bedrooms: number;
    checkInTime: string;
    checkOutTime: string;
    host: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      avatarUrl: string;
      bio: string;
      isVerified: boolean;
    };
  };
  createdAt: string;
}

// New types for booking statistics and calendar
export interface BookingStatsResponse {
  pendingCount: number;
  confirmedThisMonth: number;
  previousMonthConfirmed: number;
  expectedRevenue: number;
  upcomingRevenue: number;
}

export interface CalendarBookingResponse {
  date: string;
  type: 'available' | 'checked-in' | 'guest';
  guestName?: string;
  bookingCode?: string;
  bookingId?: number;
  status?: string;
}

export interface BookingCalendarResponse {
  month: number;
  year: number;
  monthName: string;
  bookings: CalendarBookingResponse[];
}

// Helper function to convert API BookingResponse to BookingItem
export const bookingResponseToItem = (booking: BookingResponse): BookingItem => {
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);

  // Format dates to Vietnamese format
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date).replace('.', '');
  };

  const dateRange = `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
  const duration = `${booking.numNights} đêm`;

  // Determine status
    let status: BookingItem['status'];
    switch (booking.status) {
        case 'PENDING':
            status = 'PENDING';
            break;
        case 'CONFIRMED':
            status = 'CONFIRMED';
            break;
        case 'CANCELLED':
            status = 'CANCELLED';
            break;
        case 'COMPLETED':
            status = 'COMPLETED';
            break;
        default:
            status = 'PENDING';
    }
  return {
    id: booking.id,
    image: booking.property.primaryImageUrl,
    name: booking.property.title,
    location: `${booking.property.city}, ${booking.property.country}`,
    dateRange,
    duration,
    status
  };
};

