import axios from "axios";
import { useBookingContext } from "./useBookingContext";
import { useState } from "react";

export const useAddBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseG, setResponseG] = useState(null);
  const [error, setError] = useState(null);
  const { dispatch } = useBookingContext();

  const SubmitBooking = async (data) => {
    setError(null);
    setResponseG(null);
    setIsLoading(false);
    try {
      setIsLoading(true);
      const response = await axios.post("/api/booking", { data });

      if (response.status === 200) {
        dispatch({ type: "NEW_BOOKING", payload: response.data });
        setResponseG(response.data.message);
      }
    } catch (err) {
      setError(err);
    }
  };
  return { isLoading, responseG, error, SubmitBooking };
};
