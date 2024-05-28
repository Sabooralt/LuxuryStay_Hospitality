import { useRoomContext } from "@/hooks/useRoomContext";
import { HeroScreen } from "../componenets/HeroScreen";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { TiGroupOutline } from "react-icons/ti";
import { Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export const ClientRooms = () => {
  const { room } = useRoomContext();
  return (
    <div className="grid gap-20">
      <HeroScreen>
        <h1 className="text-7xl">Our Rooms</h1>
        <p className="text-3xl">Discover our world's #1 Luxury Room For VIP.</p>
      </HeroScreen>

      <div className="grid gap-10 grid-cols-3 p-[7rem] justify-items-center">
        {room &&
          room.map((room) => (
            <div key={room._id} className="grid col-span-1 rounded-lg border shadow-lg max-w-[650px]">
              <div className="relative">
                <div className="w-fit relative">
                  <img
                    src={`/RoomImages/${room.images[0].filepath}`}
                    className="h-[300px] w-[600px] object-cover"
                    alt=""
                  />

                  <div className="absolute inset-0 bg-overlay"></div>
                  <div className="absolute bottom-5 left-5 font-light drop-shadow-2xl flex items-center gap-2 text-primary">
                    Featured Room{" "}
                    <div className="flex gap-1">
                      {[1, 2, 3].map((_,index) => (
                        <StarFilledIcon  key={index}/>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white px-5 py-3 text-justify font-light grid gap-5">
                  <h1 className="text-3xl text-secondary">
                    {room.type.type} Room
                  </h1>

                  <div className="flex gap-5 items-center ">
                    <div className="flex gap-2 items-center">
                      <TiGroupOutline className="w-6 h-6" />
                      {room.capacity} Guests
                    </div>
                    <div className="flex gap-2 items-center">
                      <Crop className="w-6 h-6" />
                      <span>
                        22 ft <sup>2</sup>
                      </span>
                    </div>
                  </div>

                  <p className="tracking-tight line-clamp-6 text-ellipsis overflow-hidden font-normal text-md font-sans">
                    {room.description}
                  </p>

                  <Button className="bg-secondary capitalize w-fit p-5 rounded-none">
                    Book Now for Rs.{room.pricePerNight}
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
