import { useStaffAuthContext } from "@/hooks/useStaffAuth";
import { TopBar } from "../components/TopBar";
import { FeedbackTable } from "../components/feedback/FeedbackTable";
import { useFeedbackContext } from "@/context/feedbackContext";
import axios from "axios";
import { useAuthContextProvider } from "@/hooks/useAuthContext";

export const Feedbacks = () => {
  const { user } = useAuthContextProvider();
  const { feedback, dispatch } = useFeedbackContext();
  useEffect(() => {
    const fetchFeedback = async () => {
      dispatch({ type: "CLEAR_FEEDBACKs" });
      try {
        const response = await axios("/api/feedback/get_feedback");

        if (response.status === 200) {
          dispatch({ type: "SET_FEEDBACKS", payload: response.data.feedbacks });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchFeedback();
  }, [user]);
  return (
    <>
      <TopBar>Guest Feedback</TopBar>

      <FeedbackTable />
    </>
  );
};
