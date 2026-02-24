# Search & Filter Implementation - Quick Start

## What Was Done

I've implemented a complete search and filtering system for your rental listings page. Here's what was added:

### New Files Created:
1. **`app/listings/components/ListingsClient.tsx`** - Main client component with search/filter state management
2. **`lib/filterBuilder.ts`** - Utility functions to build Django filter query parameters
3. **`lib/useListingsSearch.ts`** - Custom React hook for reusable search logic
4. **`SEARCH_FILTER_DOCS.md`** - Complete documentation

### Files Modified:
1. **`app/listings/page.tsx`** - Updated to use new ListingsClient component
2. **`app/listings/components/filterPanel.tsx`** - Converted to interactive component with callbacks
3. **`data/listings.tsx`** - Updated DataLoader to accept query parameter objects

## Key Features

✅ **Text Search** - Search properties by name, location, or description
✅ **Price Range Filter** - Drag slider to set min/max price
✅ **Amenity Filtering** - Multi-select amenities (WiFi, Pool, Gym, etc.)
✅ **Real-time Updates** - Results update instantly as you filter
✅ **Loading States** - Visual feedback while fetching data
✅ **Error Handling** - Graceful handling of API errors
✅ **Reset Filters** - One-click button to clear all filters

## How It Works

### 1. User Search Flow:
```
User Types → Search Input Updated
    ↓
Press Enter or Click Search Button
    ↓
filterBuilder.buildFilterParams() converts filters to Django API params
    ↓
API Request: GET /properties/?search=beach&price__gte=100&price__lte=5000
    ↓
Results Display in Grid
```

### 2. Filter Interactions:
- **Price Slider**: Drag to set range (updates on release)
- **Amenity Checkboxes**: Click to select/deselect (updates immediately)
- **Reset Button**: Clears all filters and shows all properties

## Django API Integration

The search system sends these parameters to your Django API:

| Parameter | Example | Description |
|-----------|---------|-------------|
| `search` | `?search=beach` | Full-text search |
| `location` | `?location=kololi` | Filter by location |
| `price__gte` | `?price__gte=100` | Minimum price (django-filter) |
| `price__lte` | `?price__lte=5000` | Maximum price (django-filter) |
| `amenities__id__in` | `?amenities__id__in=1,2,3` | Multiple amenities |

**Your Django API must have django-filter configured to handle these parameters.**

## Usage in Components

### In ListingsClient (already done):
```typescript
const handleSearch = useCallback(() => {
  const newFilters = { ...filters, search: searchQuery }
  setFilters(newFilters)
  fetchListings(newFilters)
}, [filters, searchQuery, fetchListings])
```

### Using the Custom Hook (optional):
```typescript
import { useListingsSearch } from '@/lib/useListingsSearch'

const MyComponent = () => {
  const { 
    listings, 
    isLoading, 
    handleSearch, 
    handlePriceChange 
  } = useListingsSearch({ 
    initialListings, 
    accessToken 
  })
  
  // Use in your component...
}
```

## Environment Setup

Make sure your `.env.local` has:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Testing the Implementation

1. **Test Search**:
   - Go to `/listings` page
   - Type "beach" in search box and press Enter
   - Should show filtered results

2. **Test Price Filter**:
   - Drag price slider to adjust min/max
   - Results should update immediately

3. **Test Amenities**:
   - Check/uncheck amenity boxes
   - Results should filter accordingly

4. **Test Reset**:
   - Apply some filters
   - Click "Reset Filters" button
   - Should show all properties again

## API Response Format Expected

Your Django API should respond with:
```json
[
  {
    "id": "1",
    "name": "Beach Villa",
    "price": 150,
    "image": "https://...",
    "location": "kololi",
    "description": "Beautiful beach property",
    "amenities": [
      { "id": "1", "name": "WiFi" },
      { "id": "2", "name": "Pool" }
    ]
  },
  ...
]
```

## Adding More Filters

To add additional filters (e.g., bedrooms, bathrooms):

1. **Update FilterState interface** in `useListingsSearch.ts`:
```typescript
interface FilterState {
  minPrice: number
  maxPrice: number
  amenities: string[]
  location: string
  search: string
  bedrooms?: number;  // ADD THIS
}
```

2. **Update filterBuilder.ts** to include new params:
```typescript
if (filters.bedrooms !== undefined) {
  params.bedrooms = filters.bedrooms
}
```

3. **Add UI control in FilterPanel.tsx**:
```typescript
<Select 
  value={selectedBedrooms}
  onChange={(e) => onBedroomChange(parseInt(e.target.value))}
>
  <option value="">Any bedrooms</option>
  <option value="1">1 Bedroom</option>
  <option value="2">2 Bedrooms</option>
  ...
</Select>
```

## Troubleshooting

### Search not working?
- [ ] Check `NEXT_PUBLIC_API_URL` is correct
- [ ] Verify Django API is running
- [ ] Check browser console for API errors
- [ ] Ensure authentication token is being sent

### Filters not updating?
- [ ] Check network tab to see if requests are being made
- [ ] Verify Django API is receiving query parameters
- [ ] Check Django FilterSet configuration
- [ ] Verify response data structure

### Empty results?
- [ ] Verify data exists in Django database
- [ ] Check API response in browser DevTools
- [ ] Test API directly: `curl http://localhost:8000/api/properties/?search=beach`

## Files Dependency Map

```
app/listings/page.tsx (Server)
    ↓
    ├→ ListingsClient.tsx (Client)
    │   ├→ FilterPanel.tsx
    │   ├→ PropertyCard.tsx
    │   └→ filterBuilder.ts
    │
    └→ DataLoader (getListings, getAmenities)
        └→ Api (axios instance)
```

## Next Steps (Optional Enhancements)

1. **URL State**: Save filters in URL for shareable links
   ```typescript
   const router = useRouter()
   const params = buildQueryString(filters)
   router.push(`/listings?${params}`)
   ```

2. **Debounce Search**: Reduce API calls while typing
   ```typescript
   import { debounce } from 'lodash'
   const debouncedSearch = debounce(handleSearch, 500)
   ```

3. **Sorting Options**: Add sort by price, rating, etc.

4. **Pagination**: Add limit/offset for large datasets

5. **Map View**: Show properties on interactive map

---

**Implementation Complete** ✅
All components are fully functional and ready to use.
