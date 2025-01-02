// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, // Link to booking
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to user
  eventOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventOwner', required: true }, // Link to event owner
  amount: { type: Number, required: true }, // Total payment amount
  commission: { type: Number, required: true }, // Admin's commission
  ownerShare: { type: Number, required: true }, // Event owner's share
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentId: { type: String, required: true }, // Payment gateway-specific ID
  paymentMethod: { type: String, enum: ['card', 'netbanking', 'upi', 'wallet'], required: true }, // Payment method
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
