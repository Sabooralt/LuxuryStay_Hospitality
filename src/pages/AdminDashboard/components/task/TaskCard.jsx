import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { useTaskContext } from "@/hooks/useTaskContext";
import axios from "axios";
import { formatDate, formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { socket } from "@/socket";

export const TaskCard = ({ task }) => {
  const { dispatch } = useTaskContext();
  const [selected, setSelected] = useState(false);

  const { staff } = useStaffAuthContext();

  const { user } = useAuthContextProvider();

  const staffId = staff._id;
  const taskId = task._id;

  let bgColorClass;
  switch (task.priority.toLowerCase()) {
    case "low":
      bgColorClass = "bg-green-600";
      break;
    case "medium":
      bgColorClass = "bg-yellow-500";
      break;
    case "high":
      bgColorClass = "bg-orange-500";
      break;
    case "very high":
      bgColorClass = "bg-red-600";
      break;
    default:
      bgColorClass = "bg-gray-400";
      break;
  }

  const handleDeleteTask = async (id) => {
    try {
      const response = await axios.delete("/api/task/delete/" + id);

      if (response.status === 200) {
        dispatch({ type: "DELETE_TASK", payload: response.data });
        console.log("task deleted successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

 

  const markTaskAsSeen = async () => {
    try {
      if (!staff) {
        return null;
      }
      const response = await axios.post(
        `/api/task/${taskId}/seenBy/${staffId}`
      );
      if (response.status === 200) {
        console.log("Task Seen!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card
      onClick={markTaskAsSeen}
      className={`p-4 pb-6 relative grid shadow-md rounded-[0.4rem] w-full hover:bg-gray-100 transition duration-300 gap-2 cursor-pointer  ${
        selected ? "bg-gray-100" : ""
      } `}
    >
      <CardHeader className="grid p-0">
        <div className="justify-between grid items-center grid-cols-2 gap-1">
          <p className="font-semibold capitalize">
            {task.createdBy.first_name} {task.createdBy.last_name}{" "}
          </p>
          <p
            className={` ${
              !selected ? "text-muted-foreground" : "text-black"
            }   text-sm ml-auto`}
          >
            {formatDistanceToNow(new Date(task.createdAt), {
              addSuffix: true,
            })}
          </p>
          <p className="m-0 font-medium text-xs capitalize space-y-0-0">
            {task.title}
          </p>
        </div>
      </CardHeader>

      <CardDescription className="line-clamp-[2] text-ellipsis overflow-hidden">
        {task.description}
      </CardDescription>

      <CardContent className="flex flex-row justify-between items-center p-0">
        <Badge>{task.status}</Badge>
        <Badge className={`pointer-events-none ${bgColorClass}`}>
          {task.priority}
        </Badge>
      </CardContent>

      <CardFooter className="p-0 relative">
        <div className="flex flex-row gap-1 text-xs">
          <p>Deadline: </p>
          <p className="font-semibold capitalize">
            {formatDistanceToNow(new Date(task.deadline), {
              addSuffix: true,
            })}{" "}
          </p>
        </div>
        <div className="absolute flex flex-row justify-between bottom-[-20px] gap-1 w-full text-xs">
          <p className="text-xs italic">
            {formatDate(new Date(task.deadline), "MM/dd/yyyy")}
          </p>

          {user && user.role === "admin" && (
            <div className="flex gap-1">
              {task.seenBy && (
                <>
                  <p className="font-semibold">Seen By: </p>

                  {task.seenBy.map((seen, index) => (
                    <p className="flex flex-row items-center ">
                      {seen.username}{" "}
                      <CheckCheck className="h-3.5 w-3.h-3.5 text-blue-600" />{" "}
                      {index !== task.seenBy.length - 1 && ", "}
                    </p>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
        {user && user.role === "admin" && (
          <>
            <div className="flex flex-row ml-auto gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="w-fit h-fit p-2 ml-auto"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};
