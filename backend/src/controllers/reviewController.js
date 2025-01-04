import Review from "../models/Review.js";

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
    const newReview = await Review.create(req.body);

    // Calculate the average rating for the event owner
    const reviews = await Review.find({ eventOwner: req.body.eventOwner });
    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    res.status(201).json({
      status: "success",
      data: {
        review: newReview,
        averageRating: averageRating,
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
