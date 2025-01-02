import express from 'express';
import {
  createEventOwner,
  getAllEventOwners,
  getEventOwnerById,
  updateEventOwner,
  deleteEventOwner,
  addReview,
  updateStatus
} from '../controllers/eventOwnerController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Create a new Event Owner
// Only 'event_owner' and 'admin' can access this route
router.post('/create', authenticateToken, authorizeRole('event_owner', 'admin'), createEventOwner);

// Get all Event Owners
// Only 'admin' can access this route
router.get('/getall', authenticateToken, authorizeRole('admin'), getAllEventOwners);

// Get a specific Event Owner by ID
// Anyone can access this route
router.get('/:id', getEventOwnerById);

// Update Event Owner details
// Only the event owner or admin can update
router.put('/update/:id', authenticateToken, authorizeRole('event_owner', 'admin'), updateEventOwner);

// Delete an Event Owner
// Only admin can delete an event owner
router.delete('/delete/:id', authenticateToken, authorizeRole('admin'), deleteEventOwner);

// Add a Review to an Event Owner
// logged in users can add a review
router.post('/:id/reviews', authenticateToken, addReview);

// Update Event Owner status
// Only 'admin' can update status
router.patch('/:id/status', authenticateToken, authorizeRole('admin'), updateStatus);

export default router;
