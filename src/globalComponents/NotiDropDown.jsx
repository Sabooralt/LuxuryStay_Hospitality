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
import { Bell, Check, Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { NotiItem } from "./NotiItem";

export const NotiDropDown = ({ user, userType }) => {
  const { noti, dispatch } = useNotiContext();

  const markAllAsSeen = async () => {
    try {
      const response = await axios.put(
        `/api/notis/mark-all-seen/${userType}/${user._id}`
      );

      if (response.status === 200) {
        dispatch({ type: "MARK_ALL_AS_SEEN", payload: response.data });
        console.log("marked as seen!", response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const totalUnseenLength =
    noti &&
    noti.reduce((totalLength, notification) => {
      return totalLength + (notification.seen === false ? 1 : 0);
    }, 0);

  return (
    <div className="grid gap-2 relative">
      <Badge className="absolute bg-black text-primary font-light rounded-full w-[17px] h-[17px] p-0 bottom-[-2px] right-[-2px] grid items-center justify-center">
        {totalUnseenLength ? totalUnseenLength : 0}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="bg-gray-300 hover:bg-gray-400" size="icon">
            <Bell className="w-5 text-black h-5 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[25rem] grid gap-2">
          <DropdownMenuLabel className="flex flex-row justify-between items-center">
            <h3 className="text-lg">Notifications</h3>
            <p
              onClick={markAllAsSeen}
              className="font-semibold cursor-pointer text-sm flex flex-row items-center text-blue-400"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </p>
          </DropdownMenuLabel>
          <div className="flex flex-row justify-between items-center text-sm px-2">
            <p>Earlier</p>
            <Link
              to={`${
                userType === "staff"
                  ? "/staff/notifications"
                  : userType === "user"
                  ? "/admin/notificaitons"
                  : "/"
              }`}
              className="font-semibold cursor-pointer"
            >
              See All
            </Link>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <ScrollArea className="h-80 w-full rounded-md border">
              {noti ? (
                noti.map((noti, index) => <NotiItem key={index} noti={noti} />)
              ) : (
                <p className="text-xl size-full justify-center flex items-center font-semibold">
                  You have 0 notifications.
                </p>
              )}
            </ScrollArea>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
