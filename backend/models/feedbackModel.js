const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    guestId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    rating: { type: Number, required: true },
    body: { type: String, required: true },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [{ type: String, default: [] }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
