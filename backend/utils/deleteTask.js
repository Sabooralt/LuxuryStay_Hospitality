const cron = require("node-cron");
const Task = require("../models/taskModel");

cron.schedule("0 * * * *", async () => {
  try {
    const tenHoursAgo = new Date();
    tenHoursAgo.setHours(tenHoursAgo.getHours() - 10);

    const expiredTasks = await Task.find({
      $expr: {
        $lt: [
          { $concat: ["$deadlineDate", "T", "$deadlineTime"] }, 
          tenHoursAgo.toISOString(), 
        ],
      },
    });

    for (const task of expiredTasks) {
      await task.remove();
      console.log(`Task deleted: ${task._id}`);
    }
  } catch (error) {
    console.error("Error deleting expired tasks:", error);
  }
});
