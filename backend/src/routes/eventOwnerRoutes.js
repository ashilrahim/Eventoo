import express from "express";
import {
  createEventOwner,
  getAllEventOwners,
  getEventOwnerById,
  updateEventOwner,
} from "../controllers/eventOwnerController.js";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import uploadImages from "../middleware/upload.js";

const router = express.Router();

// Create a new Event Owner
// Only 'event_owner' and  can access this route
router.post(
  "/create",
  authenticateToken,
  authorizeRole("event_owner"),
  uploadImages,
  createEventOwner
);

// Get all Event Owners

router.get("/getall",  getAllEventOwners);

// Get a specific Event Owner by ID
// Anyone can access this route
router.get("/:id", authenticateToken, getEventOwnerById);

// Update Event Owner details
// Only the event owner or admin can update
router.put(
  "/update/:id",
  authenticateToken,
  authorizeRole("event_owner", "admin"),
  uploadImages,
  updateEventOwner
);

export default router;
