'use client'
import {type Listing} from "@/data/listings"
import { Image } from "@heroui/image"
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react"
import { Share, Heart } from "lucide-react"
import { Button } from "@heroui/button"

const Banner = ({listing}: {listing: any}) => {
  return (
    <div className="w-full flex flex-col gap-4 mb-6">
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/listings">Listings</BreadcrumbItem>
        <BreadcrumbItem href={`/listings/property/${listing?.id}`}>{listing?.name}</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="font-bold text-3xl w-full">{listing?.name}</h1>

      {/* Hero Image */}
      <div className="relative h-[60vh] w-full rounded-lg overflow-hidden">
        <Image
          src={listing?.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"}
          alt={listing?.name || "Property Image"}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button isIconOnly variant="flat" size="sm" className="bg-white/80">
            <Share size={16} />
          </Button>
          <Button isIconOnly variant="flat" size="sm" className="bg-white/80">
            <Heart size={16} />
          </Button>
        </div>
      </div>

      {/* Photo Thumbnails */}
      <div className="flex gap-2 overflow-x-auto">
        {/* {listing?.images?.slice(1).map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            width={100}
            height={100}
            className="rounded-lg object-cover cursor-pointer flex-shrink-0"
          />
        ))} */}
      </div>
    </div>
  )
}

export default Banner