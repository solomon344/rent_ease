# Django Backend Configuration Examples

This file contains example Django code to ensure your backend is configured to work with the search and filter system.

## Installation

```bash
pip install django-filter
```

## Settings.py Configuration

```python
# settings.py

INSTALLED_APPS = [
    # ...
    'rest_framework',
    'django_filters',
    # ...
]

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
}
```

## Models Example

```python
# models.py
from django.db import models
from django.contrib.auth.models import User

class Amenity(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Amenities"


class Property(models.Model):
    LOCATION_CHOICES = [
        ('banjul', 'Banjul'),
        ('kololi', 'Kololi'),
        ('kotu', 'Kotu'),
        ('fajara', 'Fajara'),
        ('brufut', 'Brufut'),
        ('serekunda', 'Serekunda'),
        ('bakau', 'Bakau'),
    ]
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=50, choices=LOCATION_CHOICES)
    image = models.URLField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    amenities = models.ManyToManyField(Amenity, related_name='properties')
    guests = models.IntegerField(default=1)
    bedrooms = models.IntegerField(default=1)
    baths = models.IntegerField(default=1)
    rating = models.FloatField(default=0)
    review_count = models.IntegerField(default=0)
    is_superhost = models.BooleanField(default=False)
    host_experience = models.IntegerField(default=0)
    cleaning_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class Reservation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
        ('cancelled', 'Cancelled'),
    ]
    
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='reservations')
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    check_in = models.DateField()
    check_out = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
```

## Serializers

```python
# serializers.py
from rest_framework import serializers
from .models import Property, Amenity

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name', 'description', 'icon']


class PropertySerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    owner = serializers.SerializerMethodField()
    
    class Meta:
        model = Property
        fields = [
            'id', 'name', 'description', 'price', 'location',
            'image', 'owner', 'amenities', 'guests', 'bedrooms',
            'baths', 'rating', 'review_count', 'is_superhost',
            'host_experience', 'cleaning_fee', 'service_fee'
        ]
    
    def get_owner(self, obj):
        return {
            'id': obj.owner.id,
            'name': f"{obj.owner.first_name} {obj.owner.last_name}",
            'user': {
                'email': obj.owner.email,
                'first_name': obj.owner.first_name,
                'last_name': obj.owner.last_name,
            }
        }
```

## FilterSets

```python
# filters.py
from django_filters import rest_framework as filters
from django.db.models import Q
from .models import Property

class PropertyFilter(filters.FilterSet):
    # Price range filters
    price__gte = filters.NumberFilter(field_name='price', lookup_expr='gte')
    price__lte = filters.NumberFilter(field_name='price', lookup_expr='lte')
    
    # Location filter
    location = filters.CharFilter(field_name='location', lookup_expr='icontains')
    
    # Amenities filter (for multiple amenities)
    amenities__id__in = filters.CharFilter(method='filter_amenities')
    
    # Search filter (searches across name and description)
    search = filters.CharFilter(method='filter_search')
    
    # Additional filters (optional)
    guests = filters.NumberFilter(field_name='guests', lookup_expr='gte')
    bedrooms = filters.NumberFilter(field_name='bedrooms', lookup_expr='gte')
    baths = filters.NumberFilter(field_name='baths', lookup_expr='gte')
    is_superhost = filters.BooleanFilter(field_name='is_superhost')
    
    class Meta:
        model = Property
        fields = ['location', 'price', 'amenities', 'guests', 'bedrooms', 'baths']
    
    def filter_search(self, queryset, name, value):
        """Full-text search across name and description"""
        return queryset.filter(
            Q(name__icontains=value) |
            Q(description__icontains=value) |
            Q(location__icontains=value)
        )
    
    def filter_amenities(self, queryset, name, value):
        """Filter by multiple amenities (comma-separated IDs)"""
        if not value:
            return queryset
        
        amenity_ids = [int(id) for id in value.split(',') if id.isdigit()]
        if amenity_ids:
            # Properties must have ALL selected amenities
            for amenity_id in amenity_ids:
                queryset = queryset.filter(amenities__id=amenity_id)
        
        return queryset
```

## ViewSets

```python
# views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Property, Amenity
from .serializers import PropertySerializer, AmenitySerializer
from .filters import PropertyFilter


class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    # Enable filtering
    filterset_class = PropertyFilter
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['price', 'rating', 'created_at']
    ordering = ['-created_at']  # Default ordering
    
    def get_queryset(self):
        """
        Filter queryset based on query parameters
        """
        queryset = Property.objects.all().prefetch_related('amenities')
        
        # Additional filtering if needed
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location=location)
        
        return queryset


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
```

## URL Configuration

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, AmenityViewSet

router = DefaultRouter()
router.register(r'properties', PropertyViewSet)
router.register(r'amenities', AmenityViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

## Testing the API

### Test Search
```bash
curl "http://localhost:8000/api/properties/?search=beach"
```

### Test Price Range
```bash
curl "http://localhost:8000/api/properties/?price__gte=100&price__lte=5000"
```

### Test Location
```bash
curl "http://localhost:8000/api/properties/?location=kololi"
```

### Test Amenities
```bash
curl "http://localhost:8000/api/properties/?amenities__id__in=1,2,3"
```

### Test Combined Filters
```bash
curl "http://localhost:8000/api/properties/?search=beach&location=kololi&price__gte=100&price__lte=500"
```

## Admin Configuration (Optional)

```python
# admin.py
from django.contrib import admin
from .models import Property, Amenity, Reservation

@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ['name', 'id']
    search_fields = ['name']


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'price', 'owner', 'is_superhost']
    list_filter = ['location', 'is_superhost', 'created_at']
    search_fields = ['name', 'description', 'location']
    filter_horizontal = ['amenities']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['property', 'guest', 'check_in', 'check_out', 'status']
    list_filter = ['status', 'created_at']
    search_fields = ['property__name', 'guest__email']
```

## Query Examples

| Frontend Filter | Django Query | Result |
|-----------------|--------------|--------|
| Search "beach" | `?search=beach` | Properties with "beach" in name/desc |
| Price $100-500 | `?price__gte=100&price__lte=500` | Properties in range |
| Kololi location | `?location=kololi` | Properties in Kololi |
| WiFi + Pool | `?amenities__id__in=1,2` | Properties with both amenities |
| All combined | `?search=beach&location=kololi&price__gte=100&price__lte=500&amenities__id__in=1,2` | Filtered results |

## Tips

1. **Optimize Queries**: Use `select_related()` and `prefetch_related()` for better performance
2. **Pagination**: Configure in settings for large datasets
3. **Caching**: Consider caching amenities list (rarely changes)
4. **Permissions**: Adjust permission classes based on your requirements
5. **Documentation**: Use DRF's built-in API documentation at `/api/`

---

This configuration ensures your Django backend plays nicely with the Next.js frontend search and filter system.
