const {
  sendNotification,
} = require("../controllers/notificationController");
const WakeUp = require("../models/wakeUpCallModel");

const scheduleWakeUpCalls = async (req) => {
  try {
    const now = new Date();

    const wakeUpCalls = await WakeUp.find({
      wakeUpDate: now.toISOString().slice(0, 10),
      wakeUpTime: now.toLocaleTimeString([], { hour12: false }),
    });

    for (const wakeUpCall of wakeUpCalls) {
      await sendNotification(
        req,
        "Wake Up!",
        "Wake Up You Ugly Piece Of Shit!",
        " ",
        "member",
        wakeUpCall.guestId
      );
      await WakeUp.findByIdAndUpdate(wakeUpCall._id, { status: "completed" });
    }
  } catch (err) {
    console.error("Error scheduling wake-up calls:", err);
  }
};

module.exports = { scheduleWakeUpCalls };
