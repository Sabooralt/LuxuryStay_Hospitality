import { socket } from "@/socket";
import { useEffect, useState, useReducer, createContext } from "react";

export const StaffAuthContext = createContext();

export const StaffAuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        staff: action.payload,
      };
    case "LOGOUT":
      return {
        staff: null,
      };
    case "SET_ROLE":
      return {
        role: action.payload,
      };
    default:
      return state;
  }
};
export const StaffAuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(StaffAuthReducer, {
    staff: null,
  });

  const LogoutStaff = () => {
    localStorage.removeItem("staff");
    console.log("staff logged out"); // Clear staff data from local storage
    dispatch({ type: "LOGOUT" }); // Dispatch logout action
  };

  useEffect(() => {
    const staff = JSON.parse(localStorage.getItem("staff"));

    if (staff) {
      dispatch({ type: "LOGIN", payload: staff });
    }
  }, []);

  console.log("StafAuthContext state: ", state);
  return (
    <StaffAuthContext.Provider value={{ ...state, dispatch, LogoutStaff }}>
      {children}
    </StaffAuthContext.Provider>
  );
};
