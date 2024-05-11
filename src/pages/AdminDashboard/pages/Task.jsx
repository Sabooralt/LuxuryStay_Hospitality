import { TopBar } from "../components/TopBar";
import { AddTask } from "../components/task/AddTask";
import { TaskCard } from "../components/task/TaskCard";

export const Tasks = () => {
  return (
    <>
      <TopBar children={"Tasks"} />
      <div className="grid grid-cols-2 items-center justify-between">
        <AddTask />
        <div className="grid gap-1">
            <TaskCard/>

        </div>
      </div>
    </>
  );
};
