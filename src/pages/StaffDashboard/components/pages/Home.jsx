import { useTaskContext } from "@/hooks/useTaskContext";
import { TaskCard } from "@/pages/AdminDashboard/components/task/TaskCard";
import { useEffect } from "react";

export const StaffHome = ({onUpdateHeading}) => {
  const { task } = useTaskContext();
  return (
    <div>
      {task ? task.map((t) => <TaskCard task={t} />) : <div>Loading...</div>}
    </div>
  );
};
