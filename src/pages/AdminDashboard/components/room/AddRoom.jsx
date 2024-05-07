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
import { useFormik } from "formik";
import * as Yup from "yup";

import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useRoomTypeContext } from "@/hooks/useRoomTypeContext";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import axios from "axios";

export const AddRoom = () => {
  const [isLoading, setIsLoading] = useState();
  const [images, setImages] = useState([]);
  const { roomTypes } = useRoomTypeContext();
  const { user } = useAuthContextProvider();

  const InsertRoom = async (data) => {
    
      const formData = new FormData();
      formData.append("roomNumber", data.roomNumber);
      formData.append("type", data.type);
      formData.append("capacity", data.capacity);
      formData.append("description", data.description);
      formData.append("pricePerNight", data.pricePerNight);
      data.images.forEach((image) => {
        formData.append("images", image);
      });
      formData.append("adminId", user._id);
      
      const response = await axios.postForm("/api/room/add", formData);
  
      console.log(response.data);
    
  };

  const formik = useFormik({
    initialValues: {
      roomNumber: "",
      type: "",
      capacity: "",
      description: "",
      pricePerNight: "",
      amenities: [],
      images: [],
    },

    validationSchema: Yup.object({
      roomNumber: Yup.string().trim().required("Room Number is required."),
      type: Yup.string().trim().required("Type is required."),
      capacity: Yup.string().trim().required("Capacity is required."),
      description: Yup.string().trim().required("Description is required."),
      pricePerNight: Yup.string().trim().required("Price is required."),
    }),
    onSubmit: async (values) => {
      try {
        await InsertRoom(values);
        console.log(values)
      } catch (error) {
        console.error("Error submitting room:", error);
       
      }
    }
  });
  const handleChange = (e) => {
    formik.setFieldValue("images", e.currentTarget.files);

    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);
  };
  return (
    <Card className="w-full max-w-md">
      <form onSubmit={formik.handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Add Room</CardTitle>
          <CardDescription>
            Please enter the room details below to create a room.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Room Number</Label>
            <Input
              type="text"
              placeholder="401"
              {...formik.getFieldProps("roomNumber")}
            />

            {formik.touched.roomNumber && formik.errors.roomNumber && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.roomNumber}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Room Type</Label>
            <Select onValueChange={(e) => formik.setFieldValue("type", e)}>
              <SelectTrigger className="w-100">
                <SelectValue
                  {...formik.getFieldProps("role")}
                  placeholder="Select a role"
                />
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
            {formik.touched.type && formik.errors.type && (
              <p className="text-red-600 m-0 text-xs">{formik.errors.type}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Room Description</Label>
            <Input type="text" {...formik.getFieldProps("description")} />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.description}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Room Capacity</Label>
            <Input type="tel" {...formik.getFieldProps("capacity")} />
            {formik.touched.capacity && formik.errors.capacity && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.capacity}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Room Price per night</Label>
            <Input type="tel" {...formik.getFieldProps("pricePerNight")} />
            {formik.touched.pricePerNight && formik.errors.pricePerNight && (
              <p className="text-red-600 m-0 text-xs">
                {formik.errors.pricePerNight}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Room Images</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleChange}
            />

            <ScrollArea className="flex flex-row overflow-auto gap-4 h-52 mt-5 whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-4 p-4">
                {images &&
                  images.map((image, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(image)}
                      className="size-cover object-cover"
                      alt={`Image ${i}`}
                    />
                  ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={!formik.isValid || !formik.dirty || isLoading}
            onClick={formik.handleSubmit}
          >
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
