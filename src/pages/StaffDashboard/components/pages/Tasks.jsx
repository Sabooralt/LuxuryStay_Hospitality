import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { useTaskContext } from "@/hooks/useTaskContext";
import { TaskCard } from "@/pages/AdminDashboard/components/task/TaskCard";
import axios from "axios";
import { useEffect } from "react";

export const StaffTasks = () => {
  const { task, dispatch } = useTaskContext();

  return (
    <div className="grid gap-2 py-2">
      {task ? task.map((t) => <TaskCard task={t} />) : <div>Loading...</div>}
    </div>
  );
};
