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
          task: state.task ? [action.payload, ...state.task] : [action.payload]
        };
      
    case "DELETE_TASK":
      return {
        task: state.task.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const TaskContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, {
    task: null,
  });
  const { staff } = useStaffAuthContext();
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
    fetchTasks();

    console.log('staff',staff)
  }, [staff]);

  useEffect(() => {
    const handleCreateTask = (newTask) => {
      if (staff && newTask && newTask.assignedTo !== undefined) {
        const loggedInStaffId = staff._id;
        if (newTask.assignedAll || newTask.assignedTo.includes(loggedInStaffId)) {
          dispatch({ type: "CREATE_TASK", payload: newTask });
        } else if (newTask.assignedAll) {
          // If assignedAll is true but the loggedInStaffId is not in assignedTo, dispatch anyway
          dispatch({ type: "CREATE_TASK", payload: newTask });
        }
      }
    };
  
    socket.on("createTask", handleCreateTask);
  
    
  }, [staff]);
  

  console.log("TaskContext state: ", state);

  return (
    <TaskContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
