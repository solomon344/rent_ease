'use client'
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Slider } from '@heroui/react'

interface FilterPanelProps {
  amenities: any[]
  onAmenityChange: (amenityId: string, isChecked: boolean) => void
  onPriceChange: (value: number | number[]) => void
  onLocationChange: (location: string) => void
  selectedAmenities: string[]
  priceRange: [number, number]
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  amenities,
  onAmenityChange,
  onPriceChange,
  onLocationChange,
  selectedAmenities,
  priceRange,
}) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    priceRange
  )

  // Update local price range when prop changes
  useEffect(() => {
    setLocalPriceRange(priceRange)
  }, [priceRange])

  const handlePriceChangeInternal = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setLocalPriceRange([value[0], value[1]])
      onPriceChange(value)
    }
  }

  const handleAmenityCheck = (amenityId: string, isChecked: boolean) => {
    onAmenityChange(amenityId, isChecked)
  }

  const handleResetFilters = () => {
    setLocalPriceRange([10, 10000])
    onPriceChange([10, 10000])
    // Reset amenities by unchecking all
    selectedAmenities.forEach((id) => {
      onAmenityChange(id, false)
    })
  }

  return (
    <div className="bg-white rounded-md px-6 py-8 lg:w-[20%] flex flex-col gap-6 border-2 border-gray-200 shrink-0 h-fit sticky top-1 left-0">
      <h1 className="font-bold text-lg">Filter Results</h1>

      {/* Price Range Filter */}
      <div className="flex flex-col gap-4 font-semibold text-gray-600 border-b pb-4 border-gray-200">
        <div className="flex justify-between items-center">
          <p>Price Range</p>
          <span className="text-sm font-semibold text-primary">
            ${localPriceRange[0]} - ${localPriceRange[1]}
          </span>
        </div>
        <Slider
          size="sm"
          value={localPriceRange}
          onChange={handlePriceChangeInternal}
          minValue={10}
          maxValue={10000}
          step={50}
          showTooltip
          className="max-w-md"
        />
      </div>

      {/* Amenities Filter */}
      <div className="flex flex-col gap-4 font-semibold text-gray-600 border-b pb-4 border-gray-200">
        <p>Amenities</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {amenities.map((amenity: any) => (
            <Checkbox
              key={amenity.id}
              isSelected={selectedAmenities.includes(amenity.id)}
              onChange={(isChecked) =>
                handleAmenityCheck(amenity.id, isChecked)
              }
            >
              <div className="flex items-center gap-2 text-slate-700">
                {amenity.icon}
                <p className="text-xs md:text-sm">{amenity.name}</p>
              </div>
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Reset Filters Button */}
      <div>
        <Button
          color="default"
          variant="bordered"
          radius="sm"
          fullWidth
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

export default FilterPanel