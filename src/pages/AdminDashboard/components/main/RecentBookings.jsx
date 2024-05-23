import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RecentBookingItem } from "@/globalComponents/RecentBookingItem";
import { useBookingContext } from "@/hooks/useBookingContext";

export const RecentBookings = () => {
  const { booking } = useBookingContext();
  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {booking ? (
          booking.map((booking) => (
            <>
              <RecentBookingItem booking={booking} />
              <Separator className="my-2" />
            </>
          ))
        ) : (
          <div>No recent bookings</div>
        )}
      </CardContent>
    </Card>
  );
};
