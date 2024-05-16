import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotiContext } from "@/hooks/useNotiContext";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Bell, Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { NotiItem } from "./NotiItem";

export const NotiDropDown = ({ user, userType }) => {
  const { noti: notis } = useNotiContext();
  const noti =
    notis &&
    notis.filter((noti) => {
      if (userType === "staff") {
        return noti.staff === user._id;
      } else if (userType === "user") {
        return noti.user === user._id;
      }
      return false;
    });
    const totalUnseenLength =
  noti &&
  noti.reduce((totalLength, notification) => {
    return totalLength + (notification.seen === false ? 1 : 0);
  }, 0);
  
  return (
    <div className="grid gap-2 relative">
          <Badge className='absolute rounded-full w-[17px] h-[17px] p-0 bottom-[-2px] right-[-2px] grid items-center justify-center'>{totalUnseenLength}</Badge>

      {noti && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[25rem] grid gap-2">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <div className="flex flex-row justify-between items-center text-sm px-2">
              <p>Earlier</p>
              <p className="font-semibold">See All</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <ScrollArea className="h-80 grid gap-2 w-full rounded-md border">
                <div className="grid gap-1">
                  {noti.map((noti) => (
                    <NotiItem noti={noti}/>
                  ))}
                </div>
              </ScrollArea>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
