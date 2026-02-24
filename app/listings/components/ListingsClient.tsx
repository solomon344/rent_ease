'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Listing } from '@/data/listings'
import FilterPanel from './filterPanel'
import PropertyCard from './PropertyCard'
import { SearchIcon } from 'lucide-react'
import { Button } from '@heroui/button'
import { buildFilterParams } from '@/lib/filterBuilder'
import Api from '@/lib/api'

interface FilterState {
  minPrice: number
  maxPrice: number
  amenities: string[]
  location: string
  search: string
}

interface ListingsClientProps {
  initialListings: Listing[]
  amenities: any[]
  accessToken?: string
}

const ListingsClient: React.FC<ListingsClientProps> = ({
  initialListings,
  amenities,
  accessToken,
}) => {
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 10,
    maxPrice: 10000,
    amenities: [],
    location: '',
    search: '',
  })

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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
  }

  // Handle search button click
  const handleSearch = useCallback(() => {
    const newFilters = { ...filters, search: searchQuery }
    setFilters(newFilters)
    fetchListings(newFilters)
  }, [filters, searchQuery, fetchListings])

  // Handle Enter key in search
  const handleSearchKeypress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch]
  )

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

  return (
    <div className="w-full flex flex-col gap-6 px-6 py-8 bg-gray-200/10">
      <h1 className="font-bold text-3xl">Find Your Next Stay</h1>

      {/* Search Bar */}
      <div className="bg-white px-4 py-3 rounded-lg shadow-md shadow-gray-200/20 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1 w-full">
          <SearchIcon size={'1.2rem'} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by location, city or neighborhood"
            className="h-full grow py-2 rounded-md outline-none border-none bg-gray-100"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeypress}
          />
        </div>

        <div>
          <Button
            color="primary"
            radius="sm"
            isLoading={isLoading}
            onClick={handleSearch}
          >
            <SearchIcon size={'1.2rem'} />
            <span className="hidden lg:block">Search</span>
          </Button>
        </div>
      </div>

      {/* Filters and Listings */}
      <div className="flex flex-col-reverse lg:flex-row gap-6 mt-[4rem]">
        <FilterPanel
          amenities={amenities}
          onAmenityChange={handleAmenityChange}
          onPriceChange={handlePriceChange}
          onLocationChange={handleLocationChange}
          selectedAmenities={filters.amenities}
          priceRange={[filters.minPrice, filters.maxPrice]}
        />

        {/* Listings Grid */}
        <div className="grow grid grid-cols-1 md:grid-cols-2 items-center lg:grid-cols-3 gap-6">
          {isLoading ? (
            <p className="w-full text-center col-span-3">Loading listings...</p>
          ) : listings?.length === 0 ? (
            <p className="w-full text-center col-span-3">No listings found.</p>
          ) : (
            listings.map((listing) => (
              <PropertyCard key={listing.id} {...listing} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default ListingsClient
