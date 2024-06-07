import { useFeedbackContext } from "@/context/feedbackContext";
import { useState } from "react";
import { useAuthContextProvider } from "./useAuthContext";
import axios from "axios";

export const useVoteFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthContextProvider();
  const { dispatch } = useFeedbackContext();

  const voteFeedback = async (feedbackId, voteType) => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        return null;
      }
      const response = await axios.patch(
        "/api/feedback/vote_feedback",
        {
          feedbackId: feedbackId,
          guestId: user._id,
          voteType,
        }
      );

      if (response.status === 200) {
        dispatch({ type: "VOTE_FEEDBACK", payload: response.data });
      }
    } catch (error) {
      setError(error.message);
      console.error("Error voting:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, voteFeedback };
};
