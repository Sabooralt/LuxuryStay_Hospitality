const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {

    adminId:{
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    roomNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    type: {
      type: Schema.Types.ObjectId,
      ref: "roomType",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum : ["occupied","occupied","available"],
      default : "occupied"
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
    },
    images: [
      {
        filepath: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
