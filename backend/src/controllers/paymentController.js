import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

export const processPayment = async (req, res) => {
  try {
    const { userId,  bookingId, paymentMethod, paymentId } = req.body;

    if (!userId || !bookingId || !paymentMethod || !paymentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

       // Extract the totalAmount from the booking
       const totalAmount = booking.totalAmount;
       if (!totalAmount) {
         return res.status(400).json({ message: 'Total amount not available in the booking' });
       }
   
    // Define commission percentage
    const commissionPercentage = 10;
    const adminCommission = (totalAmount * commissionPercentage) / 100;
    const eventOwnerShare = totalAmount - adminCommission;

    // Save payment details
    const payment = await Payment.create({
      userId,
      eventOwnerId: booking.eventOwnerId, // Get EventOwner from booking
      bookingId,
      amount: totalAmount,
      commission,
      ownerShare,
      paymentStatus: 'paid',  // Default to 'paid'
      paymentMethod,
      paymentId,
    });

    // Update booking status
    await Booking.findByIdAndUpdate(bookingId, { status: 'success' });

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

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'username email')
      .populate('eventOwnerId', 'businessName')
      .populate('bookingId', 'eventDate');

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
