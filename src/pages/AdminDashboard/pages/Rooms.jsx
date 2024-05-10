import { Label } from "@radix-ui/react-dropdown-menu";
import { TopBar } from "../components/TopBar";
import { Input } from "@/components/ui/input";
import { AddRoom } from "../components/room/AddRoom";
import { AddRoomType } from "../components/room/AddRoomType";
import { RoomCard } from "@/globalComponents/RoomCard";
import { useRoomContext } from "@/hooks/useRoomContext";

export const Rooms = () => {
  const { room } = useRoomContext();
  return (
    <>
      <TopBar>Rooms</TopBar>

      <div className="grid flex-1 items-start grid-cols-2 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        
          <AddRoom />
          <AddRoomType />

  <div className="grid col-span-2 gap-4">
  <h1 className="text-4xl font-semibold">Rooms</h1>
<div className="grid grid-cols-4 md:grid-cols-2 col-span-2 items-start sm:grid-cols-1">
      {room && room.map((room) => <RoomCard className='row-span-1' room={room} />)}
</div>
  </div>

        
      </div>
    </>
  );
};
