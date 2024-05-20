import {
  Bell,
  BellElectricIcon,
  ClipboardList,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { NotiDropDown } from "@/globalComponents/NotiDropDown";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function StaffSidebar() {
  const { staff } = useStaffAuthContext();

  const navItems = [
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
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Luxury Stay</span>
          </Link>
          <div className="relative">
            <NotiDropDown user={staff} userType="staff" />
          </div>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item, index) => (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      key={index}
                      to={item.link}
                      className="flex w-fit items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            className="w-full flex flex-row gap-4 items-center"
            variant="outline"
          >
            {" "}
            Settings <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
