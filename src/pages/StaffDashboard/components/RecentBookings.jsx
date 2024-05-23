import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useBookingContext } from "@/hooks/useBookingContext";
import { getInitials } from "@/utils/getInitials";
import { CalendarIcon } from "@radix-ui/react-icons";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { formatDate, formatDistanceToNow } from "date-fns";
import { RecentBookingItem } from "@/globalComponents/RecentBookingItem";

export const RecentBookings = () => {
  const { booking } = useBookingContext();
  return (
    <Card className="w-full">
      <CardHeader className="font-semibold text-xl">
        <p>Recent Bookings</p>
        <p className="text-muted-foreground text-xs">
          Hover over the bookings for more details.
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
