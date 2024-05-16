const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Staff = require("../models/staffModel");
const Task = require("../models/taskModel");

const getNotis = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({
      timestamp: -1,
    });
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const sendNotificationAllStaff = async (req,title, message,link) => {
  try {
    const staffs = await Staff.find();

    for (const staff of staffs) {
      const notification = new Notification({
        staff: staff._id,
        title,
        message,
        link
      });
      await notification.save();   
      req.io.emit("notiCreated", notification);
    }
  } catch (error) {
    console.log("Error sending notification:", error);
  }
};

const sendNotificationToStaff = async (req, title, message, link,taskId) => {
    try {
      const task = await Task.findById(taskId);
  
      if (!task) {
        throw new Error("Task not found");
      }
  
      const staffMembers = await Staff.find({ _id: { $in: task.assignedTo } });
  
      for (const staffMember of staffMembers) {
        await sendNotification(req, title, message, link, 'staff', staffMember._id);
      }
  
      console.log("Notifications sent to staff members");
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  };

  const sendNotification = async (req, title, message, link, recipient,id) => {
    try {
      
if(recipient === 'staff'){
    const notification = new Notification({
      staff: id,
      title,
      message,
      link,
    });
    await notification.save();
    req.io.emit("notiCreated", notification);
}
if(recipient === 'admin'){
    const notification = new Notification({
        user: id,
        title,
        message,
      });
      await notification.save();
      req.io.emit("notiCreated", notification);
      console.log(`Notification sent to admin`);
}

console.log(`Notification sent to ${recipient}`);
  
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

const sendNotificationToAdmins = async (req,title, message) => {
  try {
    const adminUsers = await User.find({ role: "admin" });

    for (const adminUser of adminUsers) {
      const notification = new Notification({
        user: adminUser._id,
        title,
        message,
      });
      await notification.save();
      req.io.emit("notiCreated", notification);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const markSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const noti = await Notification.findById(id);

    if (!noti) {
      return res.status(404).json({
        success: false,
        message: "No such notification with the id provided",
      });
    }

    if (!id) {
      return res
        .status(404)
        .json({ success: false, message: "No such user with the id" });
    }

    const updatedNoti = await Notification.findOneAndUpdate(
      { _id: id },
      { $set: { seen: true } },
      { new: true }
    );

    req.io.emit("notiSeen", updatedNoti);

    return res.status(200).json({
      success: true,
      message: "notification marked as seen!",
      _id: updatedNoti._id,
      seen: updatedNoti.seen,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" + err });
  }
};

module.exports = {
  getNotis,
  sendNotificationToAdmins,
  markSeen,
  sendNotificationAllStaff,
  sendNotificationToStaff
};

