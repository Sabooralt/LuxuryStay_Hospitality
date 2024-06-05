const Feedback = require("../models/feedbackModel");
const Room = require("../models/productModel");
const User = require("../models/userModel");

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });

    if (reviews.length === 0) {
      return null;
    }

    const productIds = reviews.map((review) => review.productId);
    const userIds = reviews.map((review) => review.userId);

    const products = await Product.find({ _id: { $in: productIds } });
    const users = await User.find({ _id: { $in: userIds } });

    const reviewsWithDetails = reviews.map((review) => {
      const product = products.find(
        (product) => product._id.toString() === review.productId.toString()
      );
      const user = users.find(
        (user) => user._id.toString() === review.userId.toString()
      );
      return {
        review,
        product: {
          _id: product._id,
          title: product.title,
        },
        user: {
          _id: user._id,
          fullName: user.fullName,
        },
      };
    });

    res.status(200).json(reviewsWithDetails);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

const createFeedback = async (req, res) => {
  try {
    const { rating, body, tags } = req.body;
    const { guestId, roomId } = req.params;
    if (!guestId || !roomId || !rating || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const feedback = await Feedback.create({
      guestId,
      roomId,
      rating,
      body,
      tags,
    });

    res.status(201).json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ error: "Failed to create feedback", message: err });
  }
};

const voteFeedback = async (req, res) => {
  const { feedbackId, guestId, voteType } = req.body;

  try {
    let update;

    const feedback = await Feedback.findById(feedbackId);

    const hasUpvoted = feedback.upvotedBy.includes(userId);
    const hasDownvoted = feedback.downvotedBy.includes(userId);

    if (voteType === "upvote") {
      if (hasDownvoted) {
        update = {
          $inc: { upvotes: 1, downvotes: -1 },
          $addToSet: { upvotedBy: guestId },
          $pull: { downvotedBy: guestId },
        };
      } else if (hasUpvoted) {
        update = {
          $inc: { upvotes: -1 },
          $pull: { upvotedBy: guestId },
        };
      } else {
        update = {
          $inc: { upvotes: 1 },
          $addToSet: { upvotedBy: guestId },
        };
      }
    } else if (voteType === "downvote") {
      if (hasUpvoted) {
        update = {
          $inc: { upvotes: -1, downvotes: 1 },
          $addToSet: { downvotedBy: guestId },
          $pull: { upvotedBy: guestId },
        };
      } else if (hasDownvoted) {
        update = {
          $inc: { downvotes: -1 },
          $pull: { downvotedBy: guestId },
        };
      } else {
        update = {
          $inc: { downvotes: 1 },
          $addToSet: { downvotedBy: guestId },
        };
      }
    } else {
      return res.status(400).json({ error: "Invalid vote type" });
    }

    // Update the review
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      update,
      {
        new: true,
      }
    );

    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error("Error voting on feedback:", error);
    res.status(500).json({ error: "Failed to vote on feedback" });
  }
};

module.exports = { getAllReviews, createFeedback, voteFeedback };
