import { useBookingContext } from "@/hooks/useBookingContext";
import OrderSummary from "./OrderSummary";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const GuestBookings = () => {
  const { booking, selectedBooking, selectBooking } = useBookingContext();

  return (
    <div className="h-full w-full grid gap-5">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-semibold">Bookings</h1>
        <div>
          <Select
            defaultValue={`${selectedBooking ? selectedBooking.bookingId : ""}`}
            onValueChange={selectBooking}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bookings</SelectLabel>
                {booking ? (
                  booking.map((booking) => (
                    <SelectItem value={booking.bookingId}>
                      {booking.bookingId}
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-center mx-auto font-semibold">
                    You have no Bookings.
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="grid col-span-1 mr-auto"></div>

        <div className="grid col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={selectedBooking.status}>
                    <SelectTrigger id="status" aria-label="Select status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        disabled={
                          selectedBooking.status === "checkedOut" ||
                          selectedBooking.status === "checkedIn"
                        }
                        value="booked"
                      >
                        Booked
                      </SelectItem>
                      <SelectItem
                        disabled={selectedBooking.status === "checkedOut"}
                        value="checkedIn"
                      >
                        Checked In
                      </SelectItem>
                      <SelectItem value="checkedOut">Checked Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid col-span-1 gap-5 ml-auto">
          <OrderSummary />
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Room Images</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <img
                  alt="Product image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="300"
                  src={`/RoomImages/${selectedBooking.room.images[0].filepath}`}
                  width="300"
                />
                <div className="grid grid-cols-3 gap-2">
                  {selectedBooking.room.images.map((img, index) => (
                    <button>
                      <img
                        alt="Product image"
                        className="aspect-square w-full rounded-md object-cover"
                        height="84"
                        src={`/RoomImages/${img.filepath}`}
                        width="84"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
