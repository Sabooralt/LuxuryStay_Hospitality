import axios from "axios";
import { useEffect, createContext, useReducer } from "react";

export const BookingContext = createContext();

export const BookingReducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOKINGS":
      return {
        booking: action.payload,
      };
    case "CREATE_BOOKING":
      return {
        booking: [action.payload.booking, ...state.booking],
      };
    case "CLEAR_BOOKING":
      return {
        booking: null,
      };
    default:
      return state;
  }
};
export const BookingContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BookingReducer, {
    booking: null,
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get("/api/booking");

        if (response.status === 200) {
          dispatch({ type: "SET_BOOKINGS", payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchBooking();
  }, []);

  console.log("BookingContext state: ", state);
  return (
    <BookingContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};
