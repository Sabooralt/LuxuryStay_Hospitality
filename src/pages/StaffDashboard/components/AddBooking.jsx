import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MemberCombobox } from "@/components/ui/membercombobox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RoomCombobox } from "@/components/ui/roomCombobox";
import { useAddBooking } from "@/hooks/useAddBooking";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useFormik } from "formik";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import * as Yup from "yup";

export function AddBooking() {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const { isLoading, responseG, error, SubmitBooking } = useAddBooking();

  /*    const handleSelectedMemberChange = (memberId) => {
    setSelectedMember(memberId);
    formik.setFieldValue("member", memberId);
  };
  const handleSelectedRoomChange = (roomId) => {
    setSelectedRoom(roomId);
    formik.setFieldValue("room", roomId);
  }; */
  const handleCheckIn = (selectedDate) => {
    setCheckIn(selectedDate);
    formik.setFieldValue("checkIn", selectedDate);
  };
  const handleCheckOut = (selectedDate) => {
    setCheckOut(selectedDate);
    formik.setFieldValue("checkOut", selectedDate);
  };

  const formik = useFormik({
    initialValues: {
      room: selectedRoom,
      member: selectedMember,
      checkIn: checkIn,
      checkOut: checkOut,
    },

    validationSchema: Yup.object({
      room: Yup.string().trim().required("Room is required!"),
    }),

    onSubmit: (values) => {
      console.log(values);
      SubmitBooking(values);
    },
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create a booking</CardTitle>
        <CardDescription>
          Enter the booking details below to book a room for a member.
        </CardDescription>

     
      </CardHeader>
      <CardContent>
        <form className="grid gap-5">
          <div className="grid gap-2">
            <Label>Select Room</Label>
            <RoomCombobox
              onSelectedRoomChange={(roomId) => {
                setSelectedRoom(roomId);
                formik.setFieldValue("room", roomId);
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>Select Member</Label>

            <MemberCombobox
              onSelectedMemberChange={(memberId) => {
                setSelectedMember(memberId);
                formik.setFieldValue("member", memberId);
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label>Check In Date:</Label>
            <Popover className="w-full">
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={handleCheckIn}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>Check Out Date:</Label>

            <Popover className="w-full">
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOut ? (
                    format(checkOut, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={handleCheckOut}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
