import Review from "../models/Review.js";
import EventOwner from "../models/EventOwnerDetails.js";
// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user');
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get a single review
export const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user');
    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};



// Add a review
export const addReview = async (req, res) => {
  try {
    const { rating, comment, eventOwnerId } = req.body;

    // Check if all required fields are present
    if (!rating || !eventOwnerId) {
      return res.status(400).json({
        status: "fail",
        message: "Rating and eventOwner are required.",
      });
    }

    // Validate that the event owner exists and is approved
    const eventOwnerExists = await EventOwner.findOne({ _id: eventOwnerId, status: "approved" });
    if (!eventOwnerExists) {
      return res.status(404).json({
        status: "fail",
        message: "Approved event owner not found.",
      });
    }

    // Create the review and link it to the user and event owner
    const newReview = await Review.create({
      rating,
      comment,
      eventOwnerId,
      userId: req.user._id, // Assuming `req.user` contains the authenticated user
    });

    await newReview.save();

    await EventOwner.findByIdAndUpdate(eventOwnerId, {
      $push: { reviews: newReview._id }
    });

    // Update the average rating for the event owner
    const reviews = await Review.find({ eventOwnerId });
    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    // Update the event owner's average rating in their document
    eventOwnerExists.averageRating = averageRating;
    await eventOwnerExists.save();

    res.status(201).json({
      status: "success",
      data: {
        review: newReview,
        averageRating,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};


// Delete a review
export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
