import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByCustomer,
} from '../controllers/bookingController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Define routes
router.post('/create', authenticateToken, createBooking);
router.get('/customer', authenticateToken, getBookingsByCustomer);
router.get('/getall', authenticateToken, authorizeRole('admin'), getAllBookings);
router.get('/getall/:id', authenticateToken, authorizeRole('admin', 'event_owner'), getBookingById);
router.put('/updatebooking/:id', authenticateToken, updateBooking);
router.delete('/deletebooking/:id', authenticateToken, deleteBooking);

export default router;
