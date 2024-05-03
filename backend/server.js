require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();

//routes initialization

const guestRoutes = require('./routes/guestRoutes')
const staffRoutes = require('./routes/staffRoutes')


app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT, () => {
      console.log("Listening to", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  })

  app.use("/api/guest",guestRoutes);
  app.use("/api/staff",staffRoutes);

