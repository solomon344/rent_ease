'use client'
import Link from 'next/link'
import { Image } from '@heroui/image'
import { Chip } from '@heroui/chip'
import { MapPin, Star, BedDouble, Bath, Users, Heart } from 'lucide-react'
import { useState } from 'react'

const PropertyCard = ({ id, name, price, image, location, beds, baths, guests, rating, reviewCount, tags }: any) => {
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <Link href={`/listings/property/${id}`} className="group block">
      <div
        className="rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
        style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <Image
            src={image}
            fallbackSrc="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600"
            alt={name}
            className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
            removeWrapper
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Price badge */}
          <div
            className="absolute z-10 bottom-3 left-3 px-3 py-1 rounded-xl font-bold text-white text-sm backdrop-blur-sm"
            style={{ background: 'rgba(99,102,241,0.85)', boxShadow: '0 2px 10px rgba(99,102,241,0.4)' }}
          >
            D{price}<span className="font-normal opacity-80 text-xs"> /month</span>
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(w => !w) }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
          >
            <Heart
              size={15}
              className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>

          {/* Rating overlay */}
          {rating && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
              <Star size={12} className="text-amber-400" fill="#fbbf24" />
              <span className="text-white text-xs font-semibold">{rating}</span>
              {reviewCount && <span className="text-white/70 text-xs">({reviewCount})</span>}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {name}
            </h3>
          </div>

          <div className="flex items-center gap-1 mb-3">
            <MapPin size={12} className="text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 capitalize truncate">{location}</span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {guests && (
              <div className="flex items-center gap-1">
                <Users size={12} className="text-gray-400" />
                <span>{guests}</span>
              </div>
            )}
            {beds && (
              <div className="flex items-center gap-1">
                <BedDouble size={12} className="text-gray-400" />
                <span>{beds} bed{beds !== 1 ? 's' : ''}</span>
              </div>
            )}
            {baths && (
              <div className="flex items-center gap-1">
                <Bath size={12} className="text-gray-400" />
                <span>{baths} bath{baths !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard