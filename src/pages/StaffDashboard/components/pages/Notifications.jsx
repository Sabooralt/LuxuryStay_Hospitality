import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useNotiContext } from "@/hooks/useNotiContext";
import { formatDistanceToNow } from "date-fns";

export const StaffNotifications = () => {
  const { noti } = useNotiContext();
  return (
    <div>
      <h1>Notifications</h1>

      {noti &&
        noti.map((noti) => (
          <Card key={noti._id} className="p-4 grid items-center">
            <CardTitle>{noti.title}</CardTitle>
            <CardContent> {noti.message} </CardContent>
            <CardFooter>
              {formatDistanceToNow(new Date(noti.createdAt), {
                addSuffix: true,
              })}
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};
