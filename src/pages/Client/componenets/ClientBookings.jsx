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
import { ArrowRight, ArrowUpRight, CalendarOff, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderService } from "./OrderService";
import { OrderedServices } from "./OrderedServices";
import { useServiceContext } from "@/context/serviceContext";
import { useEffect } from "react";
import { useTransactionContext } from "@/context/transactionContext";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const GuestBookings = () => {
  const { booking, selectedBooking, selectBooking } = useBookingContext();
  const { dispatch, transaction } = useTransactionContext();
  const { user } = useAuthContextProvider();

  useEffect(() => {
    const fetchOrderedServices = async () => {
      try {
        const response = await axios(
          `/api/orderService/get-your-services/${user._id}`
        );

        if (response.status === 200) {
          dispatch({
            type: "SET_TRANSACTIONS",
            payload: response.data.ServiceOrders,
          });
        }
      } catch (err) {}
    };
    if (selectedBooking && user) {
      fetchOrderedServices();
    }
  }, [user, selectedBooking]);
  return selectedBooking ? (
    <div className="h-full w-full grid gap-5">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-semibold">Bookings</h1>
        <div>
          <Select
            defaultValue={`${
              selectedBooking
                ? selectedBooking.bookingId
                : "You have no bookings"
            }`}
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
        <div className="grid col-span-2">
          <OrderedServices />
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
      <div className="grid w-full">
        <OrderService />
      </div>
    </div>
  ) : (
    <div className="flex gap-2 flex-col items-center px-20">
      <CalendarOff className="size-10 text-gray-500" />
      <h1 className="text-2xl font-medium">You Have No Bookings Yet!</h1>
      <p className="">
        It looks like you haven't made any bookings yet. Why not explore our
        options and make your first booking today? We're here to help you with
        any questions you might have. Happy exploring!
      </p>

      <Link to="/rooms">
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <ArrowUpRight className="size-5" />
          Explore Rooms
        </Button>
      </Link>
    </div>
  );
};
