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

    case "MARK_COMPLETED":
      const updateStatus = state.task.map((task) => {
        if (task._id === action.payload.taskId) {
          return { ...task, status: action.payload.status, completedBy: action.payload.completedBy };
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
  const { staff,loading } = useStaffAuthContext();
  const { user } = useAuthContextProvider();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!staff) {
          console.log("No user found");
          return null;
        }
        const response = await axios.get(
          `/api/task/get_staff_tasks/${staff._id}`
        );

        if (response.status === 200) {
          dispatch({ type: "SET_TASK", payload: response.data });
        }
      } catch (err) {
        console.log("Error fetching tasks:", err);
      }
    };

    if(!loading){
      fetchTasks();

    }

    console.log("staff", staff);
  }, [staff, dispatch,loading]);

  useEffect(() => {
    const handleCreateTask = (newTask) => {
      if (staff && newTask && newTask.assignedTo !== undefined) {
        const loggedInStaffId = staff._id;
        if (
          newTask.assignedAll ||
          newTask.assignedTo.includes(loggedInStaffId)
        ) {
          dispatch({ type: "CREATE_TASK", payload: newTask });
        } else if (newTask.assignedAll) {
          dispatch({ type: "CREATE_TASK", payload: newTask });
        }
      }
    };

    const updateSeenByContext = (seenBy) => {
      console.log(seenBy);
      dispatch({ type: "SET_SEENBY", payload: seenBy });
    };

    const handleCompleted = (taskState)=>{
      dispatch({type: "MARK_COMPLETED",payload: taskState})
    }

    socket.on("taskCompleted",handleCompleted)

    socket.on("createTask", handleCreateTask);

    socket.on("taskMarkedAsSeen", updateSeenByContext);
  }, [staff]);

  console.log("TaskContext state: ", state);

  return (
    <TaskContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
