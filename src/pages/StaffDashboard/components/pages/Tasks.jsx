import { useTaskContext } from "@/hooks/useTaskContext";
import { TaskCard } from "@/pages/AdminDashboard/components/task/TaskCard";

export const StaffTasks = () => {
  const { task } = useTaskContext();
  return (
    <div>
      {task ? task.map((t) => <TaskCard task={t} />) : <div>Loading...</div>}
    </div>
  );
};
