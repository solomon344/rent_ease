'use client'
import React, { useState } from "react";
import { StarIcon } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { DatePicker } from "@heroui/date-picker";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Listing, DataLoader } from "@/data/listings";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { useSession } from "next-auth/react";


interface ReservationCardProps {
  listing: Listing;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ listing }) => {
  const [checkIn, setCheckIn] = useState<CalendarDate | null>(null);
  const [checkOut, setCheckOut] = useState<CalendarDate | null>(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  
  const dataLoader = new DataLoader();

  const nights = checkIn && checkOut ? checkOut.day - checkIn.day : 0; // Simplified
  const subtotal = listing.price * nights;
  const total = subtotal + (listing.cleaningFee || 0) + (listing.serviceFee || 0);

  const handleBook = async () => {
    setLoading(true);
    try {
      // @ts-ignore
       const success = await dataLoader.bookListing(listing, checkIn?.toString() || '', checkOut?.toString() || '', guests, total,session?.user?.access || '');
       if (success) {
         addToast({title:"Success",color:"success",description:"Booking successful."})
       } else {
         addToast({title:"Error",color:"danger",description:"Booking failed."})
       }
    }catch (error) {
      console.error('Error booking listing:', error);
      addToast({title:"Error",color:"danger",description:"Booking failed."})
    } finally {
      setLoading(false);
    }

  }

  const booked =  listing.bookings?.find(booking=>booking.user.email === session?.user?.email)

  return (
    <Card className="sticky top-4 py-4">
      <CardBody className="space-y-4 px-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold">${listing.price}</span>
            <span className="text-gray-500"> / night</span>
          </div>
          <div className="flex items-center gap-1">
            <StarIcon size={14} className="text-yellow-500" />
            <span className="text-sm">{listing.rating || 0} ({listing.reviewCount || 0})</span>
          </div>
        </div>

        <div className="space-y-2">
          <DatePicker
            label="Check-in"
            value={checkIn}
            onChange={setCheckIn}
            className="w-full"
            isRequired
            isDisabled={booked? true : false}
          />
          <DatePicker
            label="Check-out"
            value={checkOut}
            onChange={setCheckOut}
            className="w-full"
            isRequired
            isDisabled={booked? true : false}
          />

          <Input
            label="Guests"
            type="number"
            value={guests.toString()}
            isRequired
            isDisabled={booked? true : false}
            onChange={(e) => setGuests(parseInt(e.target.value))}
          />
        </div>

        <Divider />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>${listing.price} x {nights} nights</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Cleaning fee</span>
            <span>${listing.cleaningFee || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${listing.serviceFee || 0}</span>
          </div>
        </div>

        <Divider />

        <div className="flex justify-between font-semibold">
          <span>Total before taxes</span>
          <span>${total}</span>
        </div>

        <div className="space-y-2">
          {
            booked ? <p className="text-sm text-green-500 text-center">You've already booked</p> : (
            <Button onPress={handleBook} isLoading={loading} isDisabled={!checkIn || !checkOut || !guests} color="primary" radius="sm" fullWidth>
            Reserve Now
          </Button>
             )
          }
          {/* <Button isDisabled variant="bordered" radius="sm" fullWidth>
            Contact Host (Coming Soon)
          </Button> */}
        </div>
      </CardBody>
    </Card>
  );
};

export default ReservationCard;