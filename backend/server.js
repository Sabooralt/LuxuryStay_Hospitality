require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();

//routes initialization

const userRoutes = require('./routes/userRoutes')
const staffRoutes = require('./routes/staffRoutes');
const roomRoutes = require('./routes/roomRoutes');

const roomTypeRoutes = require('./routes/roomTypeRoutes');



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

  app.use("/api/user",userRoutes);
  app.use("/api/staff",staffRoutes);
  app.use("/api/roomType",roomTypeRoutes)
  app.use("/api/room",roomRoutes);


