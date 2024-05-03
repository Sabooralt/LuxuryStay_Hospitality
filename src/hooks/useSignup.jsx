import axios from "axios";
import { useState } from "react";

export const useSignup = ({typeOf}) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseG, setResponseG] = useState(null);

  const signup = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/guest/signup", {
        first_name: data.firstName,
        last_name: data.lastName,
        contact: data.contactNumber,
        email: data.email,
        password: data.password,
      });

      setResponseG(response.data);


    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.error);
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (err.request) {
        setError("No response received. Please check your internet connection.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }

    setIsLoading(false);
  };

  return { isLoading, signup, error, responseG };
};
