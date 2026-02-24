'use client'
import { type Listing } from "@/data/listings"
import { Image } from "@heroui/image"
import Link from "next/link"

const PropertyCard = ({id, name, price, image, location}:any) => {
  return (
    <Link href={`/listings/property/${id}`}>
      <div className="mb-3 bg-white p-3 rounded-sm cursor-pointer hover:shadow-lg transition-shadow">
        <Image src={image} fallbackSrc={"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"} alt={name} width={400} height={300} className="rounded-md object-cover w-full h-[200px]"/>
        <div className="mt-2 flex flex-col gap-1">
            <p className="">{name}</p>
            <p className="font-bold">${price} / night</p>
            <p className="text-gray-600 text-sm">{location}</p>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard