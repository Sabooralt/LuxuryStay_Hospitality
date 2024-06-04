import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useTaskContext } from "@/hooks/useTaskContext";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";

export const YourRequest = ({ roomNumber }) => {
  const { user } = useAuthContextProvider();
  const { guestTasks, dispatch } = useTaskContext();
  useEffect(() => {
    const fetchYourRequest = async () => {
      try {
        const response = await axios(
          `/api/guestReq/get_guest_requests/${user._id}`
        );
        if (response.status === 200) {
          dispatch({
            type: "SET_GUEST_TASKS",
            payload: response.data.GuestRequests,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (user) {
      fetchYourRequest();
    }
  }, [user]);

  const filteredTasks =
    guestTasks &&
    guestTasks.length > 0 &&
    guestTasks.filter((t) => t.roomNumber === roomNumber);
  return (
    filteredTasks && (
      <Card>
        <CardHeader>
          <CardTitle>Your Requests</CardTitle>
          <CardDescription>
            View previous room requests and their status from here.
          </CardDescription>
        </CardHeader>

        <ScrollArea className="h-[300px] rounded-md border">
          <CardContent className="flex p-2 pb-0 flex-col gap-4">
            {filteredTasks.map((req) => (
              <>
                <li key={req._id} className="grid gap-2 border-0 p-3">
                  <div className="font-medium">{req.serviceType}</div>
                  <div className="text-gray-600 text-sm line-clamp-2">
                    {req.issue}
                  </div>
                  <div className=" flex flex-row justify-between text-xs">
                    {req.completed ? (
                      <Badge variant="secondary">Request Completed!</Badge>
                    ) : req.seen ? (
                      <Badge className="text-nowrap">Staff On The Way</Badge>
                    ) : (
                      <Badge variant='outline'>Reviewing</Badge>
                    )}

                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(req.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </li>
                <Separator />
              </>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
    )
  );
};
