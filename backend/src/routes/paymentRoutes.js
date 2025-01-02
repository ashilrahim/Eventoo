import express from 'express';

import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { processPayment } from '../controllers/paymentController.js';
import { getAllPayments } from '../controllers/adminController.js';

const router = express.Router();

// Process payment
router.post('/process', authenticateToken, processPayment);

// Get all payments (admin only)
router.get('/', authenticateToken, authorizeRole('admin'), getAllPayments);

export default router;
