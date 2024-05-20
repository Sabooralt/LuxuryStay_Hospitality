import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Link,
  Outlet,
  useLocation,
  useOutlet,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { StaffSidebar } from "../Sidebar";
import { StaffHeader } from "../Header";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { TaskCard } from "@/pages/AdminDashboard/components/task/TaskCard";
import { useTaskContext } from "@/hooks/useTaskContext";
import { useEffect, useState } from "react";

export function StaffDashboard() {
  const { staff } = useStaffAuthContext();

  const location = useLocation();

  const getHeading = (path) => {
    switch (path) {
      case "/staff/rooms":
        return "Rooms";
      case "/staff/tasks":
        return "Tasks";
      case "/staff/notifications":
        return "Notifications";
      default:
        return "Dashboard";
    }
  };

  const heading = getHeading(location.pathname);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <StaffSidebar />
      <div className="flex flex-col">
        <StaffHeader />

        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">{heading}</h1>
            <p className="font-semibold">
              {staff.username} ({staff.role})
            </p>
          </div>
          <div
            className="flex flex-1 items-center rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col w-full gap-1 ">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
