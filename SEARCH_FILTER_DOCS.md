# Search & Filter Implementation Guide

## Overview

This implementation provides a complete search and filtering system for your rental listings, integrated with your Django API using django-filter. The system supports:

- **Text Search**: Search by property name, location, city, or neighborhood
- **Price Range Filtering**: Filter properties by minimum and maximum price
- **Amenity Filtering**: Filter by selected amenities (WiFi, Pool, Gym, etc.)
- **Location Filtering**: Filter by specific locations or cities
- **Real-time Updates**: Filters update listings dynamically as you interact with them

## Architecture

### Components

#### 1. **ListingsClient.tsx** (Client Component)
- Main component managing search and filter state
- Handles user interactions (search input, filter changes)
- Manages API calls and loading states
- Props:
  - `initialListings`: Initial list of properties from server
  - `amenities`: Available amenities for filtering
  - `accessToken`: Authentication token for API requests

#### 2. **FilterPanel.tsx** (Client Component)
- Interactive filter UI with controls for:
  - Price range slider (drag to select min/max price)
  - Amenity checkboxes (multi-select)
  - Reset filters button
- Props:
  - `amenities`: List of available amenities
  - `onAmenityChange`: Callback when amenity selection changes
  - `onPriceChange`: Callback when price range changes
  - `onLocationChange`: Callback when location changes
  - `selectedAmenities`: Currently selected amenity IDs
  - `priceRange`: Current price range [min, max]

#### 3. **ListingsClient.tsx** (replaced original page.tsx)
The new server component that:
- Fetches initial listings and amenities from the API
- Passes data to the client component
- Handles authentication via session

### Utilities

#### 1. **filterBuilder.ts** - Filter Query Builder
Converts filter state to Django API query parameters.

**Key Functions:**

```typescript
buildFilterParams(filters: FilterState): Record<string, any>
// Converts filter state to query parameters
// Example output:
// {
//   search: 'beach',
//   price__gte: 100,
//   price__lte: 5000,
//   amenities__id__in: '1,2,3',
//   location: 'kololi'
// }

buildQueryString(params: Record<string, any>): string
// Converts params object to URL query string

parseQueryParams(queryString: string): Partial<FilterState>
// Parses URL query params back to filter state

getDefaultFilters(): FilterState
// Returns default filter values
```

**Django API Query Parameters Supported:**

| Parameter | Description | Format |
|-----------|-------------|--------|
| `search` | Search in name/description | string |
| `location` | Filter by location | string |
| `price__gte` | Minimum price (django-filter) | number |
| `price__lte` | Maximum price (django-filter) | number |
| `amenities__id__in` | Filter by amenities | comma-separated IDs |

#### 2. **useListingsSearch.ts** - Custom Hook (Optional)
Encapsulates search logic for reusability in other components.

**Usage:**

```typescript
const {
  listings,
  isLoading,
  filters,
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleAmenityChange,
  handlePriceChange,
  resetFilters,
} = useListingsSearch({ initialListings, accessToken })
```

## Data Flow

```
User Interaction (Search/Filter)
         ↓
ListingsClient Component
         ↓
Filter State Update
         ↓
filterBuilder.buildFilterParams()
         ↓
API Request to Django (/properties/)
         ↓
Response with filtered listings
         ↓
Update UI with new listings
```

## Usage Examples

### Basic Search
```typescript
// User types in search box
<input
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
/>
```

### Price Range Filter
```typescript
<Slider
  value={[filters.minPrice, filters.maxPrice]}
  onChange={handlePriceChange}
  minValue={10}
  maxValue={10000}
/>
```

### Amenity Selection
```typescript
{amenities.map((amenity) => (
  <Checkbox
    key={amenity.id}
    isSelected={selectedAmenities.includes(amenity.id)}
    onChange={(isChecked) => handleAmenityChange(amenity.id, isChecked)}
  >
    {amenity.name}
  </Checkbox>
))}
```

## Integration with Django API

Your Django backend should have:

1. **FilterSet Implementation** (django-filter):
```python
from django_filters import rest_framework as filters
from rest_framework import viewsets

class PropertyFilter(filters.FilterSet):
    price__gte = filters.NumberFilter(field_name='price', lookup_expr='gte')
    price__lte = filters.NumberFilter(field_name='price', lookup_expr='lte')
    amenities__id__in = filters.NumberFilter(field_name='amenities')
    search = filters.CharFilter(method='filter_search')
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) | Q(description__icontains=value)
        )
    
    class Meta:
        model = Property
        fields = ['location', 'price', 'amenities']

class PropertyViewSet(viewsets.ModelViewSet):
    filterset_class = PropertyFilter
    filter_backends = (filters.DjangoFilterBackend,)
```

2. **Serializer Field Names**:
Make sure field names match your API response:
- `id`: Property ID
- `name`: Property name
- `price`: Price per night
- `image`: Primary image URL (or `imageUrl`)
- `location`: Location/city
- `amenities`: List of amenity objects with `id` and `name`

## Configuration

### Update API URL
In `lib/api.ts`, ensure your API base URL is correct:
```typescript
const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Environmental Variables
Add to `.env.local`:
```
NEXT_PUBLIC_API_URL=http://your-django-api.com/api
```

## Features

✅ **Real-time Search** - Results update as you search
✅ **Multiple Filters** - Combine price, amenities, location
✅ **Filter Reset** - Clear all filters with one click
✅ **Loading States** - Visual feedback during data fetching
✅ **Error Handling** - Graceful error handling and fallbacks
✅ **Responsive Design** - Works on mobile and desktop
✅ **Accessible** - Keyboard navigation and screen reader support

## Future Enhancements

- [ ] URL State Management: Save filters in URL for shareable links
- [ ] Filter Presets: Save favorite filter combinations
- [ ] Sorting Options: Sort by price, rating, etc.
- [ ] Map View: Show properties on an interactive map
- [ ] Saved Searches: Save searches for future reference
- [ ] Advanced Filters: Bedrooms, bathrooms, guest capacity
- [ ] Sort Options: Popular, newest, price (low-high), price (high-low)

## Troubleshooting

### Filters not applying?
1. Check `NEXT_PUBLIC_API_URL` env variable is set correctly
2. Verify Django API has django-filter installed and configured
3. Check browser console for API errors
4. Verify authentication token is being passed correctly

### Search returning empty results?
1. Verify property data exists in Django database
2. Check `search` parameter is being sent to API
3. Verify Django API search filter is implemented
4. Check API response structure matches expected format

### Styling Issues?
- Ensure HeroUI components are properly installed
- Check Tailwind CSS configuration
- Verify class names match Tailwind utilities

## File Structure

```
lib/
├── filterBuilder.ts      # Filter query builder
├── useListingsSearch.ts  # Custom hook for search logic
└── api.ts                # Axios instance

app/listings/
├── page.tsx              # Server component (entry point)
└── components/
    ├── ListingsClient.tsx    # Client component with state management
    ├── filterPanel.tsx       # Filter UI component
    └── PropertyCard.tsx      # Individual property card
```

---

**Created**: February 12, 2026
**Last Updated**: February 12, 2026
