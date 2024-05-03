import { Button } from "@/components/ui/button";

import { Badge, ChevronLeft } from "lucide-react";
import { AddStaff } from "../components/staff/AddStaff";
import StaffList from "../components/staff/StaffList";
import { useNavigate } from "react-router-dom";

export const Staff = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center gap-4">
        <Button onClick={()=> navigate(-1)} variant="outline" size="icon" className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Staff
        </h1>
        <Badge variant="outline" className="ml-auto sm:ml-0">
          In stock
        </Badge>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Save Product</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <AddStaff />
          <StaffList/>
        </div>
        

       


      </div>
    </>
  );
};


