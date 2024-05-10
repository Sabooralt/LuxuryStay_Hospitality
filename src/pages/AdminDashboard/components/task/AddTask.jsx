import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { StaffCombobox } from "@/components/ui/combobox";
import { useFormik, useFormikContext } from "formik";
import axios from "axios";
import { useAuthContextProvider } from "@/hooks/useAuthContext";

export function AddTask() {
  const [date, setDate] = useState(null);
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [assignAll, setAssignAll] = useState(false);
  const { user } = useAuthContextProvider();

  const handleSelectedStaffsChange = (staffIds) => {
    setSelectedStaffs(staffIds);
  };
  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    formik.setFieldValue("deadline",selectedDate)
  }
  const handleSubmit = async (values) => {
    if (!user) {
      return null;
    }

    try {
        const response = await axios.post(
          "/api/task/create",
          {
            ...values,
            createdBy: user._id,
            ...(assignAll ? { assignedTo: null } : { assignedTo: selectedStaffs }),
            assignedAll: assignAll,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
      
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      deadline: date,
      assignAll: assignAll,
    },
    onSubmit: async (values) => {
        console.log(values)
      await handleSubmit(values);
    },
  });
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Add Task</CardTitle>
        <CardDescription>
          Create new tasks and assign them with ease using this form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="grid gap-3">
          <div className="grid gap-2">
            <Label>Task Title</Label>
            <Input type="text" {...formik.getFieldProps("title")} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="last-name">Description</Label>
            <Textarea
              rows="1"
              {...formik.getFieldProps("description")}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Deadline</Label>
            <Popover className="w-full">
              <PopoverTrigger asChild>
                <Button

                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>Assign To: </Label>
            <StaffCombobox
              disabled={assignAll}
              onSelectedStaffsChange={handleSelectedStaffsChange}
            />
          </div>
          <div className="gap-4 grid">
            <Label>Assign to all</Label>
            <div className="flex flex-row items-center gap-2">
              <Switch
                checked={assignAll}
                onCheckedChange={() => setAssignAll((prev) => !prev)}
              />
              <Label>Assign to every staff</Label>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!formik.isValid || !formik.dirty}
            className="w-full"
          >
            Create Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
