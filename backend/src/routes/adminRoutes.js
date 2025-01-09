import express from 'express';
import { 
  getAllUsers, 
  getAllEventOwners, 
  updateEventOwnerStatus, 
  deleteUser, 
  deleteEventOwner, 
} from "../controllers/adminController.js";
import { authenticateToken, authorizeRole } from '../middleware/auth.js'; // Import middlewares
import { deleteReview, getAllReviews, getReview } from '../controllers/reviewController.js';
import { deleteBooking, getAllBookings, getBookingById } from '../controllers/bookingController.js';
import { getEventOwnerById } from '../controllers/eventOwnerController.js';

const router = express.Router();

// Admin routes with authentication and role authorization
router.get('/users', authenticateToken, authorizeRole('admin'), getAllUsers);
router.get('/event-owners', authenticateToken, authorizeRole('admin'), getAllEventOwners);
router.get('/event-owners/:id', authenticateToken, authorizeRole('admin'), getEventOwnerById);
router.get('/bookings', authenticateToken, authorizeRole('admin'), getAllBookings);
router.get('/bookings/:id', authenticateToken, authorizeRole('admin'), getBookingById);
router.delete('/bookings/:id', authenticateToken, authorizeRole('admin'), deleteBooking);
router.get('/review', authenticateToken, authorizeRole('admin'), getAllReviews);
router.get('/review/:id', authenticateToken, authorizeRole('admin'), getReview); 
router.delete('/review/:id', authenticateToken, authorizeRole('admin'), deleteReview);
router.put('/event-owners/:id/status', authenticateToken, authorizeRole('admin'), updateEventOwnerStatus);
router.delete('/users/:id', authenticateToken, authorizeRole('admin'), deleteUser);
router.delete('/event-owners/:id', authenticateToken, authorizeRole('admin'), deleteEventOwner);
router.delete('/bookings/:id', authenticateToken, authorizeRole('admin'), deleteBooking);

export default router;
