import { RoomCard } from "@/globalComponents/RoomCard";
import { useRoomContext } from "@/hooks/useRoomContext";

export const StaffRooms = () => {
  const { room } = useRoomContext();

  return (
    <>

      <div className="grid grid-cols-2 flex-wrap items-center justify-center">
        {room && room.map((room) => <RoomCard key={room._id} room={room} />)}
      </div>
    </>
  );
};
