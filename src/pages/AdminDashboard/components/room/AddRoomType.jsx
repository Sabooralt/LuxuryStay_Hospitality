import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useRoomTypeContext } from "@/hooks/useRoomTypeContext";
import { ToastAction } from "@radix-ui/react-toast";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function AddRoomType() {
  const { roomTypes, dispatch } = useRoomTypeContext();
  const [type, setType] = useState(null);
  const [error, setError] = useState(null);
  const [responseG, setResponseG] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const AddType = async (e) => {
    setError(null);

    setResponseG(null);
    setIsLoading(false);
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("/api/roomType/insert", {
        type: type,
      });

      if (response.status === 201) {
        setType('');
        dispatch({ type: "CREATE_TYPE", payload: response.data });
        setResponseG(response.data);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          setError(err.response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setError(
          "No response received. Please check your internet connection."
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
      setIsLoading(false);
    }
  };

  const DeleteRoomType = async (id)=>{

    try{
const response = await axios.delete("/api/roomType/delete/"+id)

if(response.status === 200){
  dispatch({type: "DELETE_TYPE", payload: response.data})
}
    }catch(err){
console.log(err)
    }

  }

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
        action: (
          <ToastAction altText="Try again" onClick={AddType}>
            Try again
          </ToastAction>
        ),
        position: "center",
      });
    }
  }, [error]);

  useEffect(() => {
    if (responseG) {
      toast({
        title: `${responseG.roomType.type} Room Type added successfully!`,
      });
    }
  }, [responseG]);

  return (
    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
      <Card className="w-full grid max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Add Room Type</CardTitle>
        </CardHeader>
        <form onSubmit={AddType}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Room Type</Label>
              <Input
              value={type}
                onChange={(e) => setType(e.target.value)}
                type="text"
                placeholder="Suite"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add</Button>
          </CardFooter>
        </form>
      </Card>

      <ScrollArea className="h-52 w-full rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Room Types</h4>
          {roomTypes &&
            roomTypes.map((type) => (
              <>
                <div
                  key={type._id}
                  className="text-sm flex flex-row items-center justify-between"
                >
                  {type.type}

                  <Button
                    variant="outline"
                  onClick={()=>DeleteRoomType(type._id)}
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator className="my-2" />
              </>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
