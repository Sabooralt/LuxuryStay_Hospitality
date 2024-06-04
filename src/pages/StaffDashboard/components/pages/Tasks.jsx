import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { useTaskContext } from "@/hooks/useTaskContext";
import { TaskCard } from "@/pages/AdminDashboard/components/task/TaskCard";
import axios from "axios";
import { useEffect } from "react";
import { GuestTaskCard } from "../GuestTaskCard";

export const StaffTasks = () => {
  const { task, guestTasks, } = useTaskContext();

  return (
    <div className="grid grid-col-2 gap-4 py-2">
      <div className="grid col-span-1">

      {task ? task.map((t) => <TaskCard task={t} />) : <div>Loading...</div>}
      </div>
      <div className="grid col-span-1">

      {guestTasks && guestTasks.map((t) => <GuestTaskCard task={t} />)}
      </div>
    </div>
  );
};
