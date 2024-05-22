import { Outlet } from "react-router-dom";
import { AddProduct } from "./components/AddProduct";
import { AdminHeader } from "./components/Header";
import { AdminSidebar } from "./components/SideHeader";
import { useEffect } from "react";
import { useNotiContext } from "@/hooks/useNotiContext";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import axios from "axios";
import { socket } from "@/socket";
import { useTaskContext } from "@/hooks/useTaskContext";

export function Dashboard() {
  const { dispatch } = useNotiContext();
  const { user } = useAuthContextProvider();
  const { dispatch: taskDispatch } = useTaskContext();

  useEffect(() => {
    taskDispatch({ type: "CLEAR_TASK" });
    const fetchAdminTasks = async () => {
      try {
        const response = await axios.get(
          `/api/task/get_admin_tasks/${user._id}`
        );

        if (response.status === 200) {
          taskDispatch({ type: "SET_TASK", payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchAdminTasks();
  }, []);

  useEffect(() => {
    const fetchAdminNoti = async () => {
      dispatch({ type: "CLEAR_NOTIS" });
      try {
        const response = await axios(`/api/notis/user/${user._id}`);

        if (response.status === 200) {
          dispatch({ type: "SET_NOTIS", payload: response.data.notifications });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchAdminNoti();
  }, [user]);

  useEffect(() => {
    if (user) {
      const userId = user._id;
      socket.emit("register", { role: "user", userId });
    }
  }, [user]);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <AdminHeader />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
