import axios from "axios";
import { useBookingContext } from "./useBookingContext";
import { useState } from "react";
import { useStaffAuthContext } from "./useStaffAuth";

export const useAddBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseG, setResponseG] = useState(null);
  const [error, setError] = useState(null);
  const { staff } = useStaffAuthContext();
  const { dispatch } = useBookingContext();

  const SubmitBooking = async (data) => {
    setError(null);
    setResponseG(null);
    setIsLoading(true);
    try {
      const response = await axios.post("/api/booking", {
        roomId: data.room,
        memberId: data.member,
        checkInDate: data.checkIn,
        checkOutDate: data.checkOut,
        bookedBy: staff._id,
      });

      if (response.status === 201) {
        setIsLoading(false);
        setResponseG(response.data.message);
      } else {
        setIsLoading(false);
        setError("Unexpected response status");
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return { isLoading, responseG, error, SubmitBooking };
};
