import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { useNotiContext } from "@/hooks/useNotiContext";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

export const StaffNotifications = () => {
  const { noti } = useNotiContext();

  const handleNotiSeen = async (id) => {
    try {
      const response = await axios.patch(`/api/notis/markSeen/${id}`);

      if (response.status === 200) {
        console.log("success noti updated as seen");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {noti &&
        noti.map((noti) => (
          <Card
            key={noti._id}
            onClick={() => handleNotiSeen(noti._id)}
            className={`p-4  grid gap-4 cursor-pointer ${
              !noti.seen ? "bg-gray-50 font-semibold" : ""
            }`}
          >
            <CardTitle className="p-0">{noti.title}</CardTitle>
            <CardContent className="p-0 "> {noti.message} </CardContent>
            <CardFooter className="p-0">
              {formatDistanceToNow(new Date(noti.createdAt), {
                addSuffix: true,
              })}
            </CardFooter>
          </Card>
        ))}
    </>
  );
};
