/**
 * useListingsSearch - Custom hook for managing listings search and filters
 * Encapsulates the search logic to make it reusable across components
 */

import { useState, useCallback } from 'react'
import { Listing } from '@/data/listings'
import Api from '@/lib/api'
import { buildFilterParams } from '@/lib/filterBuilder'

interface FilterState {
  minPrice: number
  maxPrice: number
  amenities: string[]
  location: string
  search: string
}

interface UseListingsSearchOptions {
  initialListings: Listing[]
  accessToken?: string
}

interface UseListingsSearchReturn {
  listings: Listing[]
  isLoading: boolean
  filters: FilterState
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleSearch: () => void
  handleFilterChange: (newFilters: Partial<FilterState>) => void
  handleAmenityChange: (amenityId: string, isChecked: boolean) => void
  handlePriceChange: (value: number | number[]) => void
  handleLocationChange: (location: string) => void
  resetFilters: () => void
}

const defaultFilters: FilterState = {
  minPrice: 10,
  maxPrice: 10000,
  amenities: [],
  location: '',
  search: '',
}

export const useListingsSearch = (
  options: UseListingsSearchOptions
): UseListingsSearchReturn => {
  const { initialListings, accessToken } = options
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  // Fetch listings with filters
  const fetchListings = useCallback(
    async (currentFilters: FilterState) => {
      setIsLoading(true)
      try {
        const params = buildFilterParams(currentFilters)
        const headers = accessToken
          ? { Authorization: `Token ${accessToken}` }
          : {}

        const response = await Api.get('/properties/', { params, headers })
        setListings(response.data as Listing[])
      } catch (error) {
        console.error('Error fetching listings:', error)
        setListings([])
      } finally {
        setIsLoading(false)
      }
    },
    [accessToken]
  )

  // Handle search
  const handleSearch = useCallback(() => {
    const newFilters = { ...filters, search: searchQuery }
    setFilters(newFilters)
    fetchListings(newFilters)
  }, [filters, searchQuery, fetchListings])

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilterState: Partial<FilterState>) => {
      const updatedFilters = { ...filters, ...newFilterState }
      setFilters(updatedFilters)
      fetchListings(updatedFilters)
    },
    [filters, fetchListings]
  )

  // Handle amenity selection
  const handleAmenityChange = useCallback(
    (amenityId: string, isChecked: boolean) => {
      setFilters((prev) => {
        const updatedAmenities = isChecked
          ? [...prev.amenities, amenityId]
          : prev.amenities.filter((id) => id !== amenityId)

        const newFilters = { ...prev, amenities: updatedAmenities }
        fetchListings(newFilters)
        return newFilters
      })
    },
    [fetchListings]
  )

  // Handle price range change
  const handlePriceChange = useCallback(
    (value: number | number[]) => {
      if (Array.isArray(value)) {
        const newFilters = {
          ...filters,
          minPrice: value[0],
          maxPrice: value[1],
        }
        setFilters(newFilters)
        fetchListings(newFilters)
      }
    },
    [filters, fetchListings]
  )

  // Handle location filter change
  const handleLocationChange = useCallback(
    (location: string) => {
      const newFilters = { ...filters, location }
      setFilters(newFilters)
      fetchListings(newFilters)
    },
    [filters, fetchListings]
  )

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setFilters(defaultFilters)
    fetchListings(defaultFilters)
  }, [fetchListings])

  return {
    listings,
    isLoading,
    filters,
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleFilterChange,
    handleAmenityChange,
    handlePriceChange,
    handleLocationChange,
    resetFilters,
  }
}
