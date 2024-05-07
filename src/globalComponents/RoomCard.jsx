import { BellIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

export function RoomCard({ className, room, ...props }) {
  const roomStatus =
    room.status === "occupied"
      ? "secondary"
      : room.status === "available"
      ? "primary"
      : room.status === "cleaning"
      ? "outline"
      : "";
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-2xl">Room: {room.roomNumber}</CardTitle>
        <CardDescription>
          <Badge variant={roomStatus} className="uppercase font-bold">
            {room.status}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Carousel className="w-full">
          <CarouselContent>
            {room.images &&
              room.images.length > 0 &&
              room.images.map((img) => (
                <CarouselItem key={img._id}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex w-100 items-center justify-center p-1">
                        <img
                          src={`/RoomImages/${img.filepath}`}
                          className="rounded-md object-fill w-[300px] h-[300px]"
                          alt=""
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
       

          <div style={{rowGap : "0.5rem"}} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1 max">
              <p className="text-sm font-medium leading-none ">
                Room description
              </p>
              <p className="text-sm text-muted-foreground max-h-[10rem] line-clamp-[3] text-ellipsis overflow-hidden">
                {room.description}
              </p>
            </div>
            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
            <div className="space-y-1 max">
              <p className="text-sm font-medium leading-none ">
                Room Capacity
              </p>
              <p className="text-sm text-muted-foreground max-h-[10rem] line-clamp-[3] text-ellipsis overflow-hidden">
                {room.capacity}
              </p>
            </div>
          </div>
       
          
       

        
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter>
    </Card>
  );
}
