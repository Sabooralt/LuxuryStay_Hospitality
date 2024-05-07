import { Label } from "@radix-ui/react-dropdown-menu"
import { TopBar } from "../components/TopBar"
import { Input } from "@/components/ui/input"
import { AddRoom } from "../components/room/AddRoom"
import { AddRoomType } from "../components/room/AddRoomType"

export const Rooms = ()=>{
    return(
        <>

        <TopBar>
            Rooms
        </TopBar>
        
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="flex flex-row justify-around gap-10">
        
       <AddRoom/>
       <AddRoomType/>
       </div>
       </div>
        </>
    )
}