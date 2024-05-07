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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useRoomTypeContext } from "@/hooks/useRoomTypeContext";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { useAddRoom } from "@/hooks/useAddRoom";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

export const AddRoom = () => {
  // Form States
  const [roomNumber, setRoomNumber] = useState(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState(null);
  const [pricePerNight, setPricePerNight] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const { toast } = useToast();

  const [roomData, setRoomData] = useState({
    roomNumber,
    description,
    type,
    capacity,
    pricePerNight,
    amenities,
    images,
  });
  useEffect(() => {
    setRoomData({
      roomNumber,
      description,
      type,
      capacity,
      pricePerNight,
      amenities,
      images,
    });
  }, [
    roomNumber,
    description,
    type,
    capacity,
    pricePerNight,
    amenities,
    images,
  ]);
  // Form States

  const { roomTypes } = useRoomTypeContext();
  const { user } = useAuthContextProvider();
  const { InsertRoom, isLoading, responseG, error } = useAddRoom();

  const handleImage = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
  };

  useEffect(() => {
    if (responseG) {
      toast({
        title: responseG,
      });
    }
  }, [responseG]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
      });
    }
  }, [error]);

  return (
    <Card className="w-full max-w-md">
      <form
        onSubmit={(e) => InsertRoom(roomData, e)}
        encType="multipart/form-data"
      >
        <CardHeader>
          <CardTitle className="text-2xl">Add Room</CardTitle>
          <CardDescription>
            Please enter the room details below to create a room.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Room Number</Label>
            <Input required
              type="number"
              placeholder="401"
              value={roomData.roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Room Type</Label>
            <Select onValueChange={(e) => setType(e)}>
              <SelectTrigger className="w-100">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Room Type</SelectLabel>
                  {roomTypes &&
                    roomTypes.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.type}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Room Description</Label>
            <Textarea required
              type="text"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Room Capacity</Label>
            <Input required type="number" onChange={(e) => setCapacity(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Room Price per night</Label>
            <Input required
              type="number"
              onChange={(e) => setPricePerNight(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Room Images</Label>
            <Input required
              type="file"
              multiple
              accept="image/*"
              onChange={handleImage}
            />

            {images.length !== 0 && (
              <ScrollArea className="flex flex-row overflow-auto gap-4 h-52 mt-5 whitespace-nowrap rounded-md border">
                <div className="flex w-max space-x-4 p-4 border">
                  {images.map((image, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(image)}
                      className="size-cover object-cover rounded-md"
                      alt={`Image ${i}`}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              <>Add Room</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
