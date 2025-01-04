import express from "express";

import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { getAllReviews,  addReview,  deleteReview } from "../controllers/reviewController.js";

const router = express.Router();

// Route to get all reviews
router.get("/getall", authenticateToken, getAllReviews);
// Route to create a new review
router.post("/reviewcreate", authenticateToken, addReview);



export default router;
