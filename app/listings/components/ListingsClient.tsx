'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Listing } from '@/data/listings'
import FilterPanel from './filterPanel'
import PropertyCard from './PropertyCard'
import { SearchIcon, SlidersHorizontal, X, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import dynamic from 'next/dynamic'
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
  latitude?: number
  longitude?: number
}

const locationChips = [
  'Banjul',
  'Kololi',
  'Kotu',
  'Fajara',
  'Brufut',
  'Serekunda',
  'Bakau',
  'Banjul West',
  'Banjul East',
  'Banjul North',
  'Banjul South',
  'Brikama',
  'Janjanbureh',
  'Kanifing',
  'Kerewan',
  'Kuntaur',
  'Mansakonko',
  'Sukuta',
  'Yundum'
]

const ListingsClient: React.FC<ListingsClientProps> = ({
  initialListings,
  amenities,
  accessToken,
  latitude,
  longitude,
}) => {
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 10,
    maxPrice: 10000,
    amenities: [],
    location: '',
    search: '',
  })

  const fetchListings = useCallback(
    async (currentFilters: FilterState) => {
      setIsLoading(true)
      try {
        const params = buildFilterParams(currentFilters)
        const headers = accessToken ? { Authorization: `Token ${accessToken}` } : {}
        const response = await Api.get('/properties/', { params, headers })
        setListings(response.data as Listing[])
      } catch {
        setListings([])
      } finally {
        setIsLoading(false)
      }
    },
    [accessToken]
  )

  const handleSearch = useCallback(() => {
    const newFilters = { ...filters, search: searchQuery }
    setFilters(newFilters)
    fetchListings(newFilters)
  }, [filters, searchQuery, fetchListings])

  const handleSearchKeypress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSearch()
    },
    [handleSearch]
  )

  const handleFilterChange = useCallback(
    (newFilterState: Partial<FilterState>) => {
      const updatedFilters = { ...filters, ...newFilterState }
      setFilters(updatedFilters)
      fetchListings(updatedFilters)
    },
    [filters, fetchListings]
  )

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

  const handlePriceChange = useCallback(
    (value: number | number[]) => {
      if (Array.isArray(value)) {
        const newFilters = { ...filters, minPrice: value[0], maxPrice: value[1] }
        setFilters(newFilters)
        fetchListings(newFilters)
      }
    },
    [filters, fetchListings]
  )

  const handleLocationChange = useCallback(
    (location: string) => {
      const newFilters = { ...filters, location }
      setFilters(newFilters)
      fetchListings(newFilters)
    },
    [filters, fetchListings]
  )

  const handleLocationChip = (loc: string) => {
    const newLoc = filters.location === loc ? '' : loc
    handleLocationChange(newLoc)
  }

  const activeFilterCount =
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.minPrice > 10 || filters.maxPrice < 10000 ? 1 : 0)

  return (
    <div className="min-h-screen flex flex-col gap-4">
      {/* Hero Header */}
      <div className="px-6 pt-12 pb-20 w-full bg-orange-500 mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold"
            style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Sparkles size={12} />
            {listings.length} properties available
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Find Your Perfect Stay
          </h1>
          <p className="text-indigo-200/70 text-lg max-w-xl mx-auto">
            Discover handpicked properties across The Gambia's most beautiful locations
          </p>
        </div>

        {/* Search Bar */}
        <div
          className="max-w-2xl mx-auto rounded-2xl p-2 flex items-center gap-2"
          style={{
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 20px 60px rgba(99,102,241,0.25)',
            border: '1px solid rgba(255,255,255,0.8)',
          }}
        >
          <div className="flex items-center gap-2 flex-1 px-3">
            <MapPin size={18} className="text-indigo-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by location, city or neighborhood..."
              className="w-full py-2.5 bg-transparent outline-none text-gray-700 text-sm placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeypress}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); handleLocationChange('') }}>
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <Button
            onPress={handleSearch}
            isLoading={isLoading}
            className="font-semibold px-6 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
            }}
            startContent={!isLoading && <SearchIcon size={16} />}
          >
            Search
          </Button>
        </div>

        {/* Location Quick Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {locationChips.map((loc) => (
            <Chip
              key={loc}
              onClick={() => handleLocationChip(loc)}
              className="px-4 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                background: filters.location === loc
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(255,255,255,0.1)',
                color: filters.location === loc ? '#fff' : 'rgba(255,255,255,0.7)',
                border: filters.location === loc
                  ? '1px solid transparent'
                  : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {loc}
            </Chip>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-7xl mx-auto px-6 pb-16">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 font-medium">
            {isLoading ? 'Searching...' : `${listings.length} propert${listings.length !== 1 ? 'ies' : 'y'} found`}
          </p>
          <Button
            size="sm"
            variant="bordered"
            className="border-gray-200 text-gray-600 font-medium"
            startContent={<SlidersHorizontal size={15} />}
            onPress={() => setFilterOpen(!filterOpen)}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ background: '#6366f1' }}>
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel */}
          <div className={`lg:block lg:w-72 flex-shrink-0 ${filterOpen ? 'block' : 'hidden'}`}>
            <FilterPanel
              amenities={amenities}
              onAmenityChange={handleAmenityChange}
              onPriceChange={handlePriceChange}
              onLocationChange={handleLocationChange}
              selectedAmenities={filters.amenities}
              priceRange={[filters.minPrice, filters.maxPrice]}
            />
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white overflow-hidden animate-pulse" style={{ border: '1px solid #e2e8f0' }}>
                    <div className="h-52 bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(99,102,241,0.08)' }}>
                  <SearchIcon size={36} style={{ color: '#6366f1' }} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No properties found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search term</p>
                <Button
                  size="sm"
                  onPress={() => {
                    setSearchQuery('')
                    setFilters({ minPrice: 10, maxPrice: 10000, amenities: [], location: '', search: '' })
                    fetchListings({ minPrice: 10, maxPrice: 10000, amenities: [], location: '', search: '' })
                  }}
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {listings.map((listing) => (
                  <PropertyCard key={listing.id} {...listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingsClient