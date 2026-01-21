import { useState, useEffect, useCallback } from 'react';
import { api, PropertyDto, propertyToListing } from '@/services/api';
import { Listing } from '@/types';

interface UsePropertiesResult {
  listings: Listing[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  search: (keyword: string) => void;
}

export const useProperties = (initialSize = 12): UsePropertiesResult => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchProperties = useCallback(async (page: number, keyword: string, append = false) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (keyword && keyword.trim()) {
        response = await api.searchProperties(keyword.trim(), page, initialSize);
      } else {
        response = await api.getProperties(page, initialSize);
      }

      if (response.success && response.data) {
        const newListings = response.data.content.map(propertyToListing);
        
        if (append) {
          setListings(prev => [...prev, ...newListings]);
        } else {
          setListings(newListings);
        }
        
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.pageNumber);
      } else {
        throw new Error(response.message || 'Failed to fetch properties');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Fallback to empty array if API fails
      if (!append) {
        setListings([]);
      }
    } finally {
      setLoading(false);
    }
  }, [initialSize]);

  // Initial load and search changes
  useEffect(() => {
    setCurrentPage(0);
    fetchProperties(0, searchKeyword);
  }, [fetchProperties, searchKeyword]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPages - 1 && !loading) {
      fetchProperties(currentPage + 1, searchKeyword, true);
    }
  }, [currentPage, totalPages, loading, fetchProperties, searchKeyword]);

  const refresh = useCallback(() => {
    setCurrentPage(0);
    fetchProperties(0, searchKeyword);
  }, [fetchProperties, searchKeyword]);

  const search = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
    // The useEffect will handle fetching when searchKeyword changes
  }, []);

  return {
    listings,
    loading,
    error,
    totalPages,
    currentPage,
    hasMore: currentPage < totalPages - 1,
    loadMore,
    refresh,
    search,
  };
};

// Hook for featured properties
export const useFeaturedProperties = (limit = 8) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const response = await api.getFeaturedProperties(limit);
        if (response.success && response.data) {
          setListings(response.data.map(propertyToListing));
        }
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { listings, loading, error };
};

// Hook for single property
export const useProperty = (id: number) => {
  const [property, setProperty] = useState<PropertyDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await api.getPropertyById(id);
        if (response.success && response.data) {
          setProperty(response.data);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
};
