/**
 * Filter builder for Django API with django-filter support
 * Converts filter state to URL query parameters
 */

interface FilterState {
  minPrice?: number
  maxPrice?: number
  amenities?: string[]
  location?: string
  search?: string
}

/**
 * Build query parameters for Django API based on filter state
 * Supports django-filter format with double underscore notation
 */
export const buildFilterParams = (filters: FilterState): Record<string, any> => {
  const params: Record<string, any> = {}

  // Search parameter - searches in name and description
  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim()
  }

  // Location/city filter
  if (filters.location && filters.location.trim()) {
    params.location = filters.location
  }

  // Price range filters using django-filter double underscore notation
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    params['price__gte'] = filters.minPrice
  }

  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    params['price__lte'] = filters.maxPrice
  }

  // Amenities filter - if amenities are selected
  if (filters.amenities && filters.amenities.length > 0) {
    // For django-filter, amenities can be passed as array or comma-separated
    // Adjust based on your Django API implementation
    params.amenities__id__in = filters.amenities.join(',')
  }

  return params
}

/**
 * Build query string from filter params
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value))
    }
  })

  return searchParams.toString()
}

/**
 * Parse query string to filter state
 */
export const parseQueryParams = (
  queryString: string
): Partial<FilterState> => {
  const params = new URLSearchParams(queryString)
  const filters: Partial<FilterState> = {}

  const search = params.get('search')
  if (search) filters.search = search

  const location = params.get('location')
  if (location) filters.location = location

  const minPrice = params.get('price__gte')
  if (minPrice) filters.minPrice = parseInt(minPrice, 10)

  const maxPrice = params.get('price__lte')
  if (maxPrice) filters.maxPrice = parseInt(maxPrice, 10)

  const amenities = params.get('amenities__id__in')
  if (amenities) filters.amenities = amenities.split(',')

  return filters
}

/**
 * Reset all filters to default state
 */
export const getDefaultFilters = (): FilterState => ({
  minPrice: 10,
  maxPrice: 10000,
  amenities: [],
  location: '',
  search: '',
})
