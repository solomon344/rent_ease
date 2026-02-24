# System Architecture & Flow Diagrams

## Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                  app/listings/page.tsx                      │
│              (Server Component - Entry Point)               │
│                                                             │
│  • Fetches initial listings data                           │
│  • Fetches amenities                                       │
│  • Gets authentication token from session                  │
│  • Passes data to ListingsClient                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           app/listings/components/ListingsClient.tsx       │
│          (Client Component - State Management)             │
│                                                             │
│  State:                                                     │
│  ├─ listings: Listing[]                                    │
│  ├─ isLoading: boolean                                     │
│  ├─ searchQuery: string                                    │
│  └─ filters: FilterState                                   │
│      ├─ minPrice, maxPrice                                │
│      ├─ amenities: string[]                               │
│      ├─ location: string                                   │
│      └─ search: string                                     │
│                                                             │
│  Functions:                                                │
│  ├─ fetchListings(filters)                                │
│  ├─ handleSearch()                                         │
│  ├─ handleAmenityChange(id, isChecked)                    │
│  ├─ handlePriceChange(value)                              │
│  └─ handleLocationChange(location)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
      ┌──────────┐ ┌──────────┐ ┌──────────┐
      │ Search   │ │ Filter   │ │ Listings │
      │ Bar      │ │ Panel    │ │ Grid     │
      └──────────┘ └──────────┘ └──────────┘
```

## Data Flow Diagram

```
User Action (Typing/Clicking)
      │
      ▼
┌──────────────────────────────────────┐
│  Update Component State              │
│  - Update searchQuery                │
│  - Update filters object             │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────┐
│  filterBuilder.buildFilterParams(filters)        │
│                                                  │
│  Converts:                                       │
│  ┌────────────────────────────────────────────┐ │
│  │ FilterState {                              │ │
│  │   search: 'beach',                        │ │
│  │   minPrice: 100,                          │ │
│  │   maxPrice: 5000,                         │ │
│  │   amenities: ['1', '2', '3'],            │ │
│  │   location: 'kololi'                      │ │
│  │ }                                          │ │
│  └────────────────────────────────────────────┘ │
│                      │                           │
│                      ▼                           │
│  ┌────────────────────────────────────────────┐ │
│  │ Query Params {                             │ │
│  │   search: 'beach',                        │ │
│  │   price__gte: 100,                        │ │
│  │   price__lte: 5000,                       │ │
│  │   amenities__id__in: '1,2,3',            │ │
│  │   location: 'kololi'                      │ │
│  │ }                                          │ │
│  └────────────────────────────────────────────┘ │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  Axios API Call                                  │
│                                                  │
│  GET /properties/?search=beach&price__gte=100   │
│      &price__lte=5000&amenities__id__in=1,2,3   │
│      &location=kololi                           │
│                                                  │
│  Headers: {                                      │
│    'Authorization': 'Token <access_token>',     │
│    'Content-Type': 'application/json'           │
│  }                                               │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  Django Backend                                  │
│  (django-filter processes parameters)           │
│                                                  │
│  - Filters by price range                       │
│  - Filters by location                          │
│  - Filters by amenities                         │
│  - Full-text search on name/description         │
│  - Orders results                               │
│  - Returns paginated results                    │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  API Response                                    │
│  [{                                              │
│    id: '1',                                      │
│    name: 'Beach Villa',                         │
│    price: 150,                                   │
│    image: 'url',                                │
│    location: 'kololi',                          │
│    amenities: [{ id: '1', name: 'WiFi' }, ...] │
│  }, ...]                                         │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  Update Listings State                           │
│  setListings(response.data)                     │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│  Re-render UI with New Results                  │
│  Display filtered property cards in grid        │
└──────────────────────────────────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────┐
│            FilterState Interface                    │
├─────────────────────────────────────────────────────┤
│ {                                                   │
│   minPrice: number         (Default: 10)           │
│   maxPrice: number         (Default: 10000)        │
│   amenities: string[]      (Default: [])           │
│   location: string         (Default: '')           │
│   search: string           (Default: '')           │
│ }                                                   │
└─────────────────────────────────────────────────────┘

State Updates:
┌───────────────┐
│ Search Input  │──→ setSearchQuery(value)
└───────────────┘

┌──────────────────┐
│ Price Slider     │──→ handlePriceChange(value)
│                  │    └─→ setFilters({...filters, minPrice, maxPrice})
└──────────────────┘

┌──────────────────┐
│ Amenity Checkbox │──→ handleAmenityChange(id, isChecked)
│                  │    └─→ setFilters with updated amenities array
└──────────────────┘

┌──────────────────┐
│ Location Select  │──→ handleLocationChange(location)
│                  │    └─→ setFilters({...filters, location})
└──────────────────┘

┌──────────────────┐
│ Reset Button     │──→ Reset all filters to defaults
│                  │    └─→ setSearchQuery('')
│                  │    └─→ setFilters(defaultFilters)
└──────────────────┘
```

## Component Interaction Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                      ListingsClient                            │
│                 (Manages All State)                            │
└───┬──────────────────────┬──────────────────┬────────────────────┘
    │                      │                  │
    │                      │                  │
Search Bar Widget      FilterPanel         Listings Grid
    │                   Component           Component
    │                      │                  │
    ├─────────────────┬────┴──────────────┼───┴──────────┐
    │                 │                   │              │
    ▼                 ▼                   ▼              ▼
Input        Price Slider           PropertyCard1  PropertyCard2
Button       Amenity Checkboxes     PropertyCard3  PropertyCard4
             Reset Button


Information Flow:
┌──────────────────────────────────────────────────────────────┐
│  Search Bar                                                  │
│  - onChange → setSearchQuery()                              │
│  - onKeyPress → handleSearch()                              │
│  - onClick Search Button → handleSearch()                   │
│      └─→ filterBuilder.buildFilterParams()                  │
│      └─→ fetchListings()                                    │
│      └─→ API Request to Django                              │
│      └─→ setListings(response)                              │
│      └─→ Re-render PropertyCards with new data              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  Filter Panel                                                │
│  - onPriceChange → handlePriceChange()                      │
│      └─→ Immediate API fetch                                │
│  - onAmenityChange → handleAmenityChange()                  │
│      └─→ Immediate API fetch                                │
│  - onClick Reset → handleResetFilters()                     │
│      └─→ Clear all state                                    │
│      └─→ Fetch all listings                                 │
└──────────────────────────────────────────────────────────────┘
```

## Filter Parameter Mapping

```
Frontend FilterState          Django Query Parameter
═══════════════════════════════════════════════════════════════

search: 'beach'           →   ?search=beach
minPrice: 100             →   ?price__gte=100
maxPrice: 5000            →   ?price__lte=5000
location: 'kololi'        →   ?location=kololi
amenities: ['1','2','3']  →   ?amenities__id__in=1,2,3

Combined:
{
  search: 'beach',
  minPrice: 100,
  maxPrice: 500,
  amenities: ['1','2'],
  location: 'kololi'
}

↓ filterBuilder.buildFilterParams() ↓

?search=beach&price__gte=100&price__lte=500
 &amenities__id__in=1,2&location=kololi
```

## API Request/Response Cycle

```
┌──────────────────────────────────┐
│  Client (Next.js)                │
│  ┌────────────────────────────┐  │
│  │ Filter State               │  │
│  │ {                          │  │
│  │   search: 'beach',        │  │
│  │   minPrice: 100,          │  │
│  │   maxPrice: 5000          │  │
│  │ }                          │  │
│  └────────────────────────────┘  │
│              │                    │
│              ▼                    │
│  ┌────────────────────────────┐  │
│  │ filterBuilder.buildParams()│  │
│  └────────────────┬───────────┘  │
│                   │               │
└───────────────────┼───────────────┘
                    │
                    ▼ HTTP Request
        ┌──────────────────────────────┐
        │    Network / Internet        │
        │                              │
        │ GET /api/properties/?       │
        │ search=beach&price__gte=100 │
        │ &price__lte=5000            │
        │                              │
        │ Headers:                     │
        │ Authorization: Token <token> │
        └──────────────┬───────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │  Django Backend              │
        │  ┌──────────────────────────┐│
        │  │ PropertyFilterSet        ││
        │  │ - Parses query params    ││
        │  │ - Applies filters        ││
        │  │ - Queries database       ││
        │  │ - Serializes data        ││
        │  └──────────────────────────┘│
        └──────────────┬───────────────┘
                       │
                       ▼ HTTP Response
        ┌──────────────────────────────┐
        │    Response JSON             │
        │  [{                          │
        │    id: '1',                 │
        │    name: 'Beach Villa',     │
        │    price: 150,              │
        │    image: 'url',            │
        │    location: 'kololi',      │
        │    amenities: [...]         │
        │  }, ...]                     │
        │                              │
        │ Status: 200 OK              │
        └──────────────┬───────────────┘
                       │
┌──────────────────────┘
│
▼
┌──────────────────────────────────┐
│  Client (Next.js)                │
│  ┌────────────────────────────┐  │
│  │ Update State               │  │
│  │ setListings(response.data) │  │
│  │ setIsLoading(false)        │  │
│  └────────────────────────────┘  │
│              │                    │
│              ▼                    │
│  ┌────────────────────────────┐  │
│  │ Re-render Component        │  │
│  │ - PropertyCard (multiple)  │  │
│  │ - Empty state if no results│  │
│  └────────────────────────────┘  │
│                                   │
│         Display Updated UI        │
└──────────────────────────────────┘
```

## Utility Function Flow

```
buildFilterParams(FilterState)
    │
    ├─→ Check search value
    │   └─→ params.search = value
    │
    ├─→ Check location value
    │   └─→ params.location = value
    │
    ├─→ Check minPrice
    │   └─→ params['price__gte'] = minPrice
    │
    ├─→ Check maxPrice
    │   └─→ params['price__lte'] = maxPrice
    │
    └─→ Check amenities array
        └─→ params.amenities__id__in = '1,2,3'
    
    ▼
    
Return: {
    search?: string
    location?: string
    price__gte?: number
    price__lte?: number
    amenities__id__in?: string
}
```

## Hook Usage Pattern

```
const useListingsSearch = (options) => {
    │
    ├─→ Initialize states:
    │   ├─ listings
    │   ├─ isLoading
    │   ├─ searchQuery
    │   └─ filters
    │
    ├─→ Define fetchListings():
    │   └─ API call with params
    │
    ├─→ Define handlers:
    │   ├─ handleSearch()
    │   ├─ handleAmenityChange()
    │   ├─ handlePriceChange()
    │   ├─ handleLocationChange()
    │   └─ resetFilters()
    │
    └─→ Return object with all
        state and handlers
```

---

These diagrams illustrate the complete architecture and how data flows through the search and filter system.
