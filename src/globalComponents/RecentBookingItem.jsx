import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/utils/getInitials";
import { formatDate, formatDistanceToNow } from "date-fns";
import { CalendarIcon, KeySquare } from "lucide-react";

export const RecentBookingItem = ({ booking }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          key={booking._id}
          className="flex relative cursor-pointer flex-row justify-between items-center gap-4 flex-wrap"
        >
          <Avatar>
            <AvatarImage
              src={`/UserPfps/${booking.member._id}`}
              alt="User Pfp"
            />
            <AvatarFallback>
              {getInitials(booking.member.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex mr-auto flex-col gap-0">
            <h4 className="font-semibold">{booking.member.fullName}</h4>

            <p className="text-muted-foreground text-sm">
              {booking.member.email}
            </p>
          </div>

          <p className="font-semibold">+Rs.{booking.totalCost}</p>
          <p className="text-muted-foreground ml-1 text-xs text-center">
            {booking.description}
          </p>
          {booking.createdAt && (
            <p className="absolute bottom-0 text-muted-foreground text-xs font-semibold right-0">
              {formatDistanceToNow(new Date(booking.createdAt), {
                addSuffix: true,
              })}
            </p>
          )}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <p className="text-sm flex items-center gap-1">
              This booking was done by
              <span className="font-semibold capitalize">
                {booking.bookedBy.username} ({booking.bookedBy.role})
              </span>
            </p>
            <div className="flex flex-col items-start pt-2 gap-2">
              <div className="flex flex-row ">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground flex flex-row gap-1">
                  <span className="font-semibold">Check In Date:</span>
                  <span>{formatDate(booking.checkInDate, "mm/dd/yyy")}</span>
                </span>
              </div>
              <div className="flex flex-row ">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground flex flex-row gap-1">
                  <span className="font-semibold">Check Out Date:</span>
                  <span>{formatDate(booking.checkOutDate, "mm/dd/yyy")}</span>
                </span>
              </div>
              <div className="flex flex-row ">
                <KeySquare className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground flex flex-row gap-1">
                  <span className="font-semibold">Access Key:</span>
                  <span>{booking.uniqueKey}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
