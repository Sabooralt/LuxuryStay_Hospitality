import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { socket } from "@/socket";
import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

export const TaskContext = createContext();

export const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_TASK":
      return {
        task: action.payload.tasks,
      };
    case "CREATE_TASK":
      return {
        ...state,
        task: state.task ? [action.payload, ...state.task] : [action.payload],
      };

    case "SET_SEENBY":
      const updatedTasks = state.task.map((task) => {
        if (task._id === action.payload.taskId) {
          return { ...task, seenBy: action.payload.seenBy };
        }
        return task;
      });

      return {
        ...state,
        task: updatedTasks,
      };

    case "DELETE_TASK":
      return {
        task: state.task.filter((w) => w._id !== action.payload._id),
      };
    case "CLEAR_TASK":
      return {
        task: null,
      };

    case "MARK_COMPLETED":
      const updateStatus = state.task.map((task) => {
        if (task._id === action.payload.taskId) {
          return {
            ...task,
            status: action.payload.status,
            completedBy: action.payload.completedBy,
          };
        }
        return task;
      });

      return {
        ...state,
        task: updateStatus,
      };
    default:
      return state;
  }
};

export const TaskContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    task: null,
  });
  const { staff, loading } = useStaffAuthContext();
  const { user } = useAuthContextProvider();
  
  useEffect(() => {
    const handleCreateTask = (newTask) => {
      dispatch({ type: "CREATE_TASK", payload: newTask });
    };

    socket.on("createTask", handleCreateTask);

    return () => {
      socket.off("createTask", handleCreateTask);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    const updateSeenByContext = (seenBy) => {
      console.log(seenBy);
      dispatch({ type: "SET_SEENBY", payload: seenBy });
    };

    const handleCompleted = (taskState) => {
      dispatch({ type: "MARK_COMPLETED", payload: taskState });
    };

    socket.on("taskCompleted", handleCompleted);
    socket.on("taskMarkedAsSeen", updateSeenByContext);

    return () => {
      socket.off("taskCompleted", handleCompleted);
      socket.off("taskMarkedAsSeen", updateSeenByContext);
    };
  }, [socket, staff, dispatch]);

  console.log("TaskContext state: ", state);

  return (
    <TaskContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
