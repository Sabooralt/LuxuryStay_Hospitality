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
import axios from "axios";
import { useNotiContext } from "@/hooks/useNotiContext";
import { socket } from "@/socket";

export function StaffDashboard() {
  const { staff } = useStaffAuthContext();
  const { dispatch } = useNotiContext();

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

  useEffect(() => {
    const fetchStaffNoti = async () => {
      dispatch({ type: "CLEAR_NOTIS" });
      try {
        const response = await axios(`/api/notis/staff/${staff._id}`);

        if (response.status === 200) {
          dispatch({ type: "SET_NOTIS", payload: response.data.notifications });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchStaffNoti();
  }, [staff]);
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    if (staff) {
      const userId = staff._id;
      socket.emit("register", { role: "staff", userId });
    }
  }, [staff]);

  return (
    <div className="grid h-screen overflow-hidden w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
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
            className="flex flex-1 overflow-y-scroll overflow-x-hidden max-h-[80vh] rounded-lg border border-dashed shadow-sm"
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
