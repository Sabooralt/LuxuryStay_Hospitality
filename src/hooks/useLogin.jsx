import { useState } from "react";
import { useAuthContextProvider } from "./useAuthContext";
import axios from "axios";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContextProvider();
  const [responseG, setResponseG] = useState(null);

  const Login = async (data) => {
   
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/user/login", {
        email: data.email,
        password: data.password,
      });

      if(response.status === 200){
        setResponseG(response.data);
        dispatch({type: "LOGIN",payload: response.data})

        localStorage.setItem("user",JSON.stringify(response.data))

      }



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

  return { isLoading, Login, error, responseG };
};
