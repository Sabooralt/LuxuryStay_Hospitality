import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

export const StaffContext = createContext();

export const staffReducer = (state, action) => {
  switch (action.type) {
    case "SET_STAFF":
      return {
        staffs: action.payload,
      };
    case "CREATE_STAFF":
      return {
        staffs: [action.payload.fullStaff, ...state.staffs],
      };

      case "UPDATE_STAFF_DETAILS": 
      const updatedDetails = state.staffs.map((staff)=>{
        if(staff._id === action.payload._id){
          return { staff: action.payload }
        }
        return staff
      })
      return{
        ...state,staffs : updatedDetails
      }
      case "UPDATE_STAFF_ROLE":
        const updatedRole = state.staffs.map((staff)=>{
          if(staff._id === action.payload._id){
            return {...staff,role: action.payload.role}
          }
          return staff
        })
        console.log("Updated staffs:", updatedRole)
      return  { ...state, staffs: updatedRole }
    case "DELETE_STAFF":
      return {
        staffs: state.staffs.filter((w) => w._id !== action.payload.staff._id),
      };
    default:
      return state;
  }
};

export const StaffsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(staffReducer, {
    staffs: null,
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("/api/staff");
        if (response.status === 201) {
          dispatch({ type: "SET_STAFF", payload: response.data });
          console.log(response.data)
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchStaff();  
  }, []);
  return (
    <StaffContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StaffContext.Provider>
  );
};
