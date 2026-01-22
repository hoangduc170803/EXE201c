// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

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
  role: string;
  avatarUrl?: string;
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
  avatarUrl: string;
  bio: string;
  isVerified: boolean;
}

export interface PropertyDto {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pricePerNight: number;
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
    return this.request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
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

  async getDistinctCities() {
    return this.request<ApiResponse<string[]>>('/properties/cities');
  }

  // Categories API
  async getCategories() {
    return this.request<ApiResponse<CategoryDto[]>>('/categories');
  }

  // Amenities API
  async getAmenities() {
    return this.request<ApiResponse<AmenityDto[]>>('/amenities');
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

