import axios from "axios";
import { useState } from "react";
import { useAuthContextProvider } from "./useAuthContext";

export const useAddRoom = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContextProvider();
  const [responseG, setResponseG] = useState(null);

  const InsertRoom = async (data, e) => {

    e.preventDefault();
    const formData = new FormData();
    formData.append("roomNumber", data.roomNumber);
    formData.append("type", data.type);
    formData.append("capacity", data.capacity);
    formData.append("description", data.description);
    formData.append("pricePerNight", data.pricePerNight);

    // Append images (if available)
    data.images.forEach((image) => {
      formData.append("images", image);
    });

    // Add any other relevant properties (e.g., adminId)
    formData.append("adminId", user._id);

    try {
      const response = await axios.post("/api/room/add", formData);
    } catch (err) {
      console.log(err);
    }
  };
  return { InsertRoom };
};
