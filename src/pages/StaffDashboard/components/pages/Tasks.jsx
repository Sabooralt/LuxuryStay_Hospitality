import { useTaskContext } from "@/hooks/useTaskContext";

export const StaffTasks = () => {
  const { task } = useTaskContext();
  return (
    <div>
      {task ? task.map((t) => <TaskCard task={t} />) : <div>Loading...</div>}
    </div>
  );
};
