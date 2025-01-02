import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

export const processPayment = async (req, res) => {
  try {
    const { userId, eventOwnerId, bookingId, totalAmount } = req.body;

    // Define commission percentage
    const commissionPercentage = 10;
    const adminCommission = (totalAmount * commissionPercentage) / 100;
    const eventOwnerShare = totalAmount - adminCommission;

    // Save payment details
    const payment = await Payment.create({
      userId,
      eventOwnerId,
      bookingId,
      totalAmount,
      adminCommission,
      eventOwnerShare
    });

    // Update booking status
    await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'success' });

    res.status(201).json({
      message: 'Payment processed successfully',
      payment
    });

    // Logic to transfer the admin's commission and event owner share
    // Use a payment gateway API for real-time transactions here (e.g., Stripe, PayPal)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
