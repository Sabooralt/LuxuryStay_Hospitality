const { getNotis, markSeen,markAllNotificationsAsSeen } = require("../controllers/notificationController");

const express = require("express");

const router = express.Router();

router.get("/staffId/:staffId", getNotis);
router.get("/", getNotis);
router.patch("/markSeen/:id", markSeen);
router.put('/mark-all-seen/:userType/:userId', markAllNotificationsAsSeen);

module.exports = router;
