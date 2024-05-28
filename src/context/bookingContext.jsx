import { socket } from "@/socket";
import axios from "axios";
import { isToday } from "date-fns";
import { useEffect, createContext, useReducer } from "react";

export const BookingContext = createContext();

export const BookingReducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOKINGS":
      const todayBookings = action.payload.bookings.filter((booking) =>
        isToday(new Date(booking.checkInDate))
      );
      return {
        booking: action.payload.bookings,
        recentBookings: todayBookings,
      };
    case "NEW_BOOKING":
      const isTodayBooking = isToday(new Date(action.payload.checkInDate));
      return {
        booking: state.booking
          ? [action.payload, ...state.booking]
          : [action.payload],
        recentBookings: isTodayBooking
          ? state.recentBookings
            ? [action.payload, ...state.recentBookings]
            : [action.payload]
          : state.recentBookings,
      };
    case "DELETE_BOOKING":
      return {
        booking: state.booking
          ? state.booking.filter((w) => !action.payload.includes(w._id))
          : [],
        recentBookings: state.recentBookings
          ? state.recentBookings.filter((w) => !action.payload.includes(w._id))
          : [],
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
    recentBookings: null,
  });

  useEffect(() => {
    const newBooking = (booking) => {
      dispatch({ type: "NEW_BOOKING", payload: booking });
    };

    const deleteBooking = (booking) => {
      dispatch({ type: "DELETE_BOOKING", payload: booking });
      console.log("booking delete", booking);
    };
    socket.on("newBooking", newBooking);
    socket.on("bookingDelete", deleteBooking);

    return () => {
      socket.off("newBooking", newBooking);
      socket.off("bookingDelete", deleteBooking);
    };
  }, [socket, dispatch]);

  console.log("BookingContext state: ", state);
  return (
    <BookingContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};
