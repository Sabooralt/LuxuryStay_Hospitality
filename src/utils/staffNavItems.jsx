import { BellElectricIcon, ClipboardList, Home, Warehouse } from "lucide-react";

export const StaffItems = [
    {
      name: "Dashboard",
      icon: <Home className="h-4 w-4" />,
      link: "/staff",
    },
    {
      name: "Tasks",
      icon: <ClipboardList className="h-4 w-4" />,
      link: "/staff/tasks",
    },
    {
      name: "Notifications",
      icon: <BellElectricIcon className="h-4 w-4" />,
      link: "/staff/notifications",
    },
    {
      name: "Rooms",
      icon: <Warehouse className="h-5 w-5" />,
      link: "/staff/rooms",
    },
  ];