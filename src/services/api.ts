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

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
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

