// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

import type {BookingResponse, CreateBookingRequest, PropertyFilter, BookingStatsResponse, BookingCalendarResponse} from '@/types';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// Auth Types
export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  isVerified?: boolean;
  isHost?: boolean;
  roles?: string[];
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface PropertyImage {
  id: number;
  imageUrl: string;
  caption: string;
  displayOrder: number;
  isPrimary: boolean;
  mediaType?: string; // 'IMAGE', 'VIDEO', 'VIDEO_360'
  fileSize?: number;
  duration?: number; // in seconds for videos
}

export interface CategoryDto {
  id: number;
  name: string;
  description: string;
  icon: string;
  slug: string;
}

export interface AmenityDto {
  id: number;
  name: string;
  icon: string;
  category: string;
}

export interface HostDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  bio: string;
  isVerified: boolean;
}

export interface PropertyDto {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  rentalType: 'LONG_TERM' | 'SHORT_TERM'; // NEW: Rental type
  address: string;
  city: string;
  state: string;
  country: string;

  // Short-term rental pricing
  pricePerNight: number;

  // Long-term rental pricing (thuê trọ)
  pricePerMonth?: number;
  electricityCost?: string;
  waterCost?: string;
  internetCost?: string;
  depositMonths?: number;
  minimumLeaseMonths?: number;

  cleaningFee: number;
  serviceFee: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  minNights: number;
  maxNights: number;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  isInstantBook: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  viewCount: number;
  host: HostDto;
  category: CategoryDto;
  images: PropertyImage[];
  amenities: AmenityDto[];
  primaryImageUrl: string;
  createdAt: string;
}

// API Service class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('token');
  }

  private setAccessToken(token: string) {
    localStorage.setItem('token', token);
  }

  private removeAccessToken() {
    localStorage.removeItem('token');
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAccessToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.removeAccessToken();
          // Optionally redirect to login or handle session expiry
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url,
          method: config.method,
          body: config.body
        });
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth API
  async login(request: LoginRequest) {
    const response = await this.request<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (response.success && response.data.accessToken) {
      this.setAccessToken(response.data.accessToken);
    }
    return response;
  }

  async register(request: RegisterRequest) {
    const response = await this.request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    if (response.success && response.data.accessToken) {
      this.setAccessToken(response.data.accessToken);
    }
    return response;
  }

  async getCurrentUser() {
    return this.request<ApiResponse<UserResponse>>('/auth/me');
  }

  logout() {
    this.removeAccessToken();
    window.location.href = '/auth';
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Properties API
  async getProperties(page = 0, size = 12, sortBy = 'createdAt', sortDir = 'desc') {
    return this.request<ApiResponse<PageResponse<PropertyDto>>>(
      `/properties?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    );
  }

  async getPropertyById(id: number) {
    return this.request<ApiResponse<PropertyDto>>(`/properties/${id}`);
  }

  async searchProperties(keyword: string, page = 0, size = 12) {
    return this.request<ApiResponse<PageResponse<PropertyDto>>>(
      `/properties/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    );
  }

  async getPropertiesByCity(city: string, page = 0, size = 12) {
    return this.request<ApiResponse<PageResponse<PropertyDto>>>(
      `/properties/city/${encodeURIComponent(city)}?page=${page}&size=${size}`
    );
  }

  async getPropertiesByCategory(categoryId: number, page = 0, size = 12) {
    return this.request<ApiResponse<PageResponse<PropertyDto>>>(
      `/properties/category/${categoryId}?page=${page}&size=${size}`
    );
  }

  async getFeaturedProperties(limit = 8) {
    return this.request<ApiResponse<PropertyDto[]>>(
      `/properties/featured?limit=${limit}`
    );
  }

  async getLongTermProperties(
    page = 0,
    size = 12,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      city?: string;
      categoryId?: number;
      propertyTypes?: string[];
      amenityIds?: number[];
      minArea?: number;
      maxArea?: number;
    }
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.city) params.append('city', filters.city);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.minArea) params.append('minArea', filters.minArea.toString());
    if (filters?.maxArea) params.append('maxArea', filters.maxArea.toString());

    // Add property types as array
    if (filters?.propertyTypes && filters.propertyTypes.length > 0) {
      filters.propertyTypes.forEach(type => params.append('propertyType', type));
    }

    // Add amenity IDs as array
    if (filters?.amenityIds && filters.amenityIds.length > 0) {
      filters.amenityIds.forEach(id => params.append('amenityIds', id.toString()));
    }

    return this.request<ApiResponse<PageResponse<PropertyDto>>>(
      `/properties/long-term?${params.toString()}`
    );
  }

  async getShortTermProperties(
    page = 0,
    size = 12,
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      city?: string;
      propertyTypes?: string[];
      amenityIds?: number[];
      minGuests?: number;
      checkIn?: string;
      checkOut?: string;
    }
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.city) params.append('city', filters.city);
    if (filters?.minGuests) params.append('minGuests', filters.minGuests.toString());
    if (filters?.checkIn) params.append('checkIn', filters.checkIn);
    if (filters?.checkOut) params.append('checkOut', filters.checkOut);

    // Add property types as array
    if (filters?.propertyTypes && filters.propertyTypes.length > 0) {
      filters.propertyTypes.forEach(type => params.append('propertyType', type));
    }

    // Add amenity IDs as array
    if (filters?.amenityIds && filters.amenityIds.length > 0) {
      filters.amenityIds.forEach(id => params.append('amenityIds', id.toString()));
    }

    return this.request<ApiResponse<PageResponse<PropertyDto>>>(
      `/properties/short-term?${params.toString()}`
    );
  }

  async getDistinctCities() {
    return this.request<ApiResponse<string[]>>('/properties/cities');
  }

  async getMyProperties(page = 0, size = 12) {
    return this.request<ApiResponse<PageResponse<PropertyDto>>>(
      `/properties/my-properties?page=${page}&size=${size}`
    );
  }

  async createProperty(data: {
    title: string;
    description: string;
    propertyType: string;
    rentalType?: 'SHORT_TERM' | 'LONG_TERM';
    address: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
    pricePerNight?: number;
    pricePerMonth?: number;
    electricityCost?: string;
    waterCost?: string;
    internetCost?: string;
    cleaningFee?: number;
    serviceFee?: number;
    securityDeposit?: number;
    depositMonths?: number;
    minimumLeaseMonths?: number;
    maxGuests: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
    areaSqft?: number;
    minNights?: number;
    maxNights?: number;
    leaseDuration?: number;
    checkInTime?: string;
    checkOutTime?: string;
    houseRules?: string;
    cancellationPolicy?: string;
    isInstantBook?: boolean;
    categoryId?: number;
    amenityIds?: number[];
    images?: Array<{ imageUrl: string; caption?: string; displayOrder?: number; isPrimary?: boolean }>;
  }) {
    return this.request<ApiResponse<PropertyDto>>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: number) {
    return this.request<ApiResponse<void>>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async updatePropertyStatus(id: number, status: 'ACTIVE' | 'PENDING' | 'INACTIVE') {
    return this.request<ApiResponse<PropertyDto>>(`/properties/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updateProperty(id: number, data: Partial<{
    title: string;
    description: string;
    propertyType: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
    pricePerNight: number;
    cleaningFee?: number;
    maxGuests: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
    categoryId?: number;
    amenityIds?: number[];
  }>) {
    return this.request<ApiResponse<PropertyDto>>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Categories API
  async getCategories() {
    return this.request<ApiResponse<CategoryDto[]>>('/categories');
  }

  // Amenities API
  async getAmenities() {
    return this.request<ApiResponse<AmenityDto[]>>('/amenities');
  }

  // Property Types API
  async getPropertyTypes() {
    return this.request<ApiResponse<string[]>>('/properties/property-types');
  }

  // Filter Properties API
  async filterProperties(filter: PropertyFilter, page = 0, size = 12) {
    const params = new URLSearchParams();

    if (filter.categoryId) params.append('categoryId', String(filter.categoryId));
    if (filter.minPrice !== undefined) params.append('minPrice', String(filter.minPrice));
    if (filter.maxPrice !== undefined) params.append('maxPrice', String(filter.maxPrice));
    if (filter.propertyType) params.append('propertyType', filter.propertyType);
    if (filter.amenityIds && filter.amenityIds.length > 0) {
      filter.amenityIds.forEach(id => params.append('amenityIds', String(id)));
    }
    if (filter.city) params.append('city', filter.city);
    if (filter.isInstantBook !== undefined) params.append('isInstantBook', String(filter.isInstantBook));
    if (filter.freeCancellation !== undefined) params.append('freeCancellation', String(filter.freeCancellation));
    if (filter.minGuests !== undefined) params.append('minGuests', String(filter.minGuests));
    if (filter.checkIn) params.append('checkIn', filter.checkIn);
    if (filter.checkOut) params.append('checkOut', filter.checkOut);

    params.append('page', String(page));
    params.append('size', String(size));

    return this.request<ApiResponse<PageResponse<PropertyDto>>>(
      `/properties/filter?${params.toString()}`
    );
  }

  // Booking API
  async getBookedDates(propertyId: number) {
    return this.request<ApiResponse<string[]>>(`/bookings/booked-dates/${propertyId}`);
  }

  async checkAvailability(propertyId: number, checkIn: string, checkOut: string) {
    return this.request<ApiResponse<{ available: boolean }>>(
      `/bookings/check-availability?propertyId=${propertyId}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
  }

  async createBooking(request: CreateBookingRequest) {
    return this.request<ApiResponse<BookingResponse>>('/bookings', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async processPayment(bookingId: number, paymentMethod: string) {
    return this.request<ApiResponse<BookingResponse>>(
      `/bookings/${bookingId}/payment?paymentMethod=${encodeURIComponent(paymentMethod)}`,
      { method: 'PUT' }
    );
  }

  async confirmBooking(bookingId: number) {
    return this.request<ApiResponse<BookingResponse>>(`/bookings/${bookingId}/confirm`, {
      method: 'PUT',
    });
  }

  async cancelBooking(bookingId: number, reason?: string) {
    const url = reason
      ? `/bookings/${bookingId}/cancel?reason=${encodeURIComponent(reason)}`
      : `/bookings/${bookingId}/cancel`;
    return this.request<ApiResponse<BookingResponse>>(url, {
      method: 'PUT',
    });
  }

  async getHostBookings(page = 0, size = 10) {
    return this.request<ApiResponse<PageResponse<BookingResponse>>>(
      `/bookings/host-bookings?page=${page}&size=${size}`
    );
  }

  async getMyBookings(page = 0, size = 10) {
    return this.request<ApiResponse<PageResponse<BookingResponse>>>(
      `/bookings/my-bookings?page=${page}&size=${size}`
    );
  }

  async getBookingById(id: number) {
    return this.request<ApiResponse<BookingResponse>>(`/bookings/${id}`);
  }

  // New booking statistics and calendar endpoints
  async getHostBookingStats() {
    return this.request<ApiResponse<BookingStatsResponse>>('/bookings/host-stats');
  }

  async getHostBookingCalendar(year?: number, month?: number) {
    const params = new URLSearchParams();
    if (year) params.append('year', String(year));
    if (month) params.append('month', String(month));
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return this.request<ApiResponse<BookingCalendarResponse>>(`/bookings/host-calendar${queryString}`);
  }

  // User Profile API
  async getUserProfile() {
    return this.getCurrentUser();
  }

  async updateUserProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    bio?: string;
  }) {
    return this.request<ApiResponse<UserResponse>>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // File Upload APIs
  async uploadImage(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    return this.uploadFileWithProgress('/files/upload-image', formData, onProgress);
  }

  async uploadImages(files: File[], onProgress?: (progress: number) => void) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return this.uploadFileWithProgress('/files/upload-images', formData, onProgress);
  }

  async uploadVideo(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    return this.uploadFileWithProgress('/files/upload-video', formData, onProgress);
  }

  async upload360Video(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    return this.uploadFileWithProgress('/files/upload-video-360', formData, onProgress);
  }

  async getUploadConfig() {
    return this.request<ApiResponse<{
      cloudinaryEnabled: boolean;
      maxImageSize: string;
      maxVideoSize: string;
      supportedImageFormats: string[];
      supportedVideoFormats: string[];
      maxImagesPerProperty: number;
      maxVideosPerProperty: number;
    }>>('/files/config');
  }

  private async uploadFileWithProgress(
    endpoint: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    const token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.message || 'Upload failed'));
          } catch (e) {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', `${this.baseUrl}${endpoint}`);

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  }
}

// Export singleton instance
export const api = new ApiService(API_BASE_URL);

// Helper function to convert API property to frontend Listing format
export const propertyToListing = (property: PropertyDto) => ({
  id: String(property.id),
  image: property.primaryImageUrl || property.images?.[0]?.imageUrl || '',
  location: `${property.city}, ${property.country}`,
  details: `${property.propertyType} • ${property.bedrooms} bedrooms • ${property.maxGuests} guests`,
  dates: 'Available now',
  rating: property.averageRating || 0,
  price: property.pricePerNight,
  isGuestFavorite: property.isFeatured,
});

