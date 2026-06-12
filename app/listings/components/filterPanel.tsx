'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@heroui/button'
import { Checkbox, Slider } from '@heroui/react'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'

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
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange)

  useEffect(() => {
    setLocalPriceRange(priceRange)
  }, [priceRange])

  const handlePriceChangeInternal = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setLocalPriceRange([value[0], value[1]])
      onPriceChange(value)
    }
  }

  const handleResetFilters = () => {
    setLocalPriceRange([10, 10000])
    onPriceChange([10, 10000])
    selectedAmenities.forEach((id) => onAmenityChange(id, false))
    onLocationChange('')
  }

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-6 h-fit sticky top-4"
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
            <SlidersHorizontal size={14} style={{ color: '#6366f1' }} />
          </div>
          <h2 className="font-bold text-gray-900 text-sm">Filters</h2>
        </div>
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-indigo-600"
          style={{ color: '#6b7280' }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Price Range</p>
          <span
            className="text-xs font-bold px-2 py-1 rounded-lg"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}
          >
            D{localPriceRange[0]} – D{localPriceRange[1]}
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
          classNames={{
            track: 'bg-gray-200',
            filler: 'bg-gradient-to-r from-indigo-500 to-purple-500',
            thumb: 'bg-indigo-600 shadow-md',
          }}
        />
      </div>

      <div className="h-px" style={{ background: '#f1f5f9' }} />

      {/* Amenities */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Amenities</p>
        <div className="flex flex-col gap-2.5">
          {amenities.map((amenity: any) => (
            <Checkbox
              key={amenity.id}
              isSelected={selectedAmenities.includes(amenity.id)}
              onChange={(isChecked) => onAmenityChange(amenity.id, isChecked)}
              classNames={{
                label: 'text-sm text-gray-600',
                wrapper: 'before:border-gray-300',
              }}
            >
              <div className="flex items-center gap-2 text-gray-600">
                <span className="w-5 h-5 flex items-center justify-center text-gray-500">
                  {amenity.icon}
                </span>
                <span className="text-sm">{amenity.name}</span>
              </div>
            </Checkbox>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterPanel