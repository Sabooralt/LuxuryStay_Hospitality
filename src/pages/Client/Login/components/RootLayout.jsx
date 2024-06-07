import { useState, useEffect } from "react";
import { useFeedbackContext } from "@/context/feedbackContext";
import { FeedbackCard } from "@/globalComponents/FeedbackCard";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export const LoginRoot = () => {
  const { feedback } = useFeedbackContext();
  const [currentFeedback, setCurrentFeedback] = useState(
    feedback ? feedback[0] : null
  );

  useEffect(() => {
    if (feedback && feedback.length > 0) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * feedback.length);
        setCurrentFeedback(feedback[randomIndex]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [feedback]);

  return (
    <div className="grid w-full place-items-center h-screen overflow-hidden grid-cols-2">
      <div className="bg-zinc-900 relative bg-[url('/ClientImages/luxuryblack.jpg')] bg-no-repeat bg-cover bg-center overflow-hidden size-full grid col-span-1">
        <div className="absolute inset-0 bg-overlay"></div>

        <AnimatePresence mode="wait" className="z-40">
          {currentFeedback && (
            <motion.div
              key={currentFeedback._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col px-10 py-5 z-40 text-white overflow-hidden mt-auto text-xl"
            >
              <span>"{currentFeedback.body}"</span>
              <span className="text-sm font-medium">
                {currentFeedback.guestId.fullName}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="grid col-span-1">
        <Outlet />
      </div>
    </div>
  );
};
