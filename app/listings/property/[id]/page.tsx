import React from "react";
import Banner from "./components/Banner";
import ReservationCard from "./components/ReservationCard";
import { Amenity, DataLoader } from "@/data/listings";
import { StarIcon, Users, Bed, Bath, Share, Heart } from "lucide-react";
import { Divider } from "@heroui/divider";
import { Badge } from "@heroui/badge";
import { auth } from "@/lib/auth";
import { amenities } from "@/data/listings";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth()
  const dataLoader = new DataLoader();
  // @ts-ignore
  const listing = await  dataLoader.getListingById(id,session?.user?.access);

  if (!listing) {
    return <div>Listing not found</div>;
  }

  return (
    <div className="w-full bg-background-light min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Banner listing={listing} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Host */}
            <div>
              <h1 className="text-3xl font-bold">{listing.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <StarIcon size={16} className="text-yellow-500" />
                <span className="font-semibold">{listing.rating || 0}</span>
                <span className="text-gray-500">({listing.reviewCount || 0} reviews)</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{listing.location}</span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Hosted by {listing?.owner?.user?.first_name || 'Unknown'} {listing?.owner?.user?.last_name || 'Host'}
                  {listing.isSuperhost && <Badge color="primary" className="ml-2">Superhost</Badge>}
                  {listing.hostExperience && ` • ${listing.hostExperience} years hosting`}
                </p>
               
              </div>
            </div>

            <Divider />

            {/* Details */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>{listing.guests || 1} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Bed size={20} />
                {/* @ts-ignore */}
                <span>{listing.beds || 1} bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={20} />
                <span>{listing.baths || 1} baths</span>
              </div>
            </div>

            <Divider />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-2">About this place</h2>
              <p className="text-gray-700">{listing.description}</p>
              <br />
               <p>
                  {listing?.bookings?.length} {listing?.bookings?.length === 1 ? 'booking' : 'bookings'}
                </p>
            </div>

            <Divider />

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold mb-3">What this place offers</h2>
              <div className="grid grid-cols-2 gap-3">
                {listing?.amenities?.map((amenity:{name:string}, index:number) => (
                  <div key={index} className="flex items-center gap-2">
                    {amenities[amenity.name].icon}
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            {/* Map */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Where you'll be</h2>
              <div className="rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik`}
                />
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <ReservationCard listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
