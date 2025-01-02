import express from 'express';
import { 
  getAllUsers, 
  getAllEventOwners, 
  getAllBookings, 
  updateEventOwnerStatus, 
  deleteUser, 
  deleteEventOwner, 
  deleteBooking 
} from "../controllers/adminController.js";
import { authenticateToken, authorizeRole } from '../middleware/auth.js'; // Import middlewares

const router = express.Router();

// Admin routes with authentication and role authorization
router.get('/users', authenticateToken, authorizeRole('admin'), getAllUsers);
router.get('/event-owners', authenticateToken, authorizeRole('admin'), getAllEventOwners);
router.get('/bookings', authenticateToken, authorizeRole('admin'), getAllBookings);

router.put('/event-owners/:id/status', authenticateToken, authorizeRole('admin'), updateEventOwnerStatus);

router.delete('/users/:id', authenticateToken, authorizeRole('admin'), deleteUser);
router.delete('/event-owners/:id', authenticateToken, authorizeRole('admin'), deleteEventOwner);
router.delete('/bookings/:id', authenticateToken, authorizeRole('admin'), deleteBooking);

export default router;
