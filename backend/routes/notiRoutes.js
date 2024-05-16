const { getNotis, markSeen } = require("../controllers/notificationController");

const express = require("express");

const router = express.Router();

router.get("/staffId/:staffId", getNotis);
router.get("/", getNotis);
router.patch("/markSeen/:id", markSeen);

module.exports = router;
