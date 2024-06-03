import {
  Activity,
  CreditCard,
  DollarSign,
  RefreshCcw,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentTransactions from "../components/transactions/RecentTransactions";
import { RecentBookings } from "../components/main/RecentBookings";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import axios from "axios";

export function DashboardHome() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getTotalUsers = (count) => {
      setTotalCount(count);
    };

    socket.on("clientCount", getTotalUsers);

    return () => {
      socket.off("clientCount", getTotalUsers);
    };
  }, [socket]);

  useEffect(() => {
    const getTotalRevenue = async () => {
      setIsLoading(false);

      try {
        setIsLoading(true);
        const response = await axios.get("/api/booking/total-revenue");

        if (response.status === 200) {
          setTotalRevenue(response.data.totalRevenue);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getTotalRevenue();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(false);

    try {
      setIsLoading(true);

      const response = await axios.get("/api/booking/total-revenue");

      if (response.status === 200) {
        setTotalRevenue(response.data.totalRevenue);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <RefreshCcw
              onClick={handleRefresh}
              className={`h-4 w-4 text-muted-foreground cursor-pointer  ${
                isLoading ? "animate-spin" : "animate-none"
              }`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs.{totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <RecentTransactions />
        <RecentBookings />
      </div>
    </main>
  );
}
