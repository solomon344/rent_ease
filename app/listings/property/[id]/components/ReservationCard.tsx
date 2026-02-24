'use client'
import React, { useState } from "react";
import { StarIcon } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { DatePicker } from "@heroui/date-picker";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { Listing } from "@/data/listings";

interface ReservationCardProps {
  listing: Listing;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ listing }) => {
  const [checkIn, setCheckIn] = useState<CalendarDate | null>(null);
  const [checkOut, setCheckOut] = useState<CalendarDate | null>(null);

  const nights = checkIn && checkOut ? checkOut.day - checkIn.day : 5; // Simplified
  const subtotal = listing.price * nights;
  const total = subtotal + (listing.cleaningFee || 0) + (listing.serviceFee || 0);

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
          />
          <DatePicker
            label="Check-out"
            value={checkOut}
            onChange={setCheckOut}
            className="w-full"
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
          <Button isDisabled color="primary" radius="sm" fullWidth>
            Reserve (Coming Soon)
          </Button>
          <Button isDisabled variant="bordered" radius="sm" fullWidth>
            Contact Host (Coming Soon)
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ReservationCard;