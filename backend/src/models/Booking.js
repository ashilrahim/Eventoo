// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventOwner', required: true },
  eventDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }  // Reference to the payment
});

export default mongoose.model('Booking', bookingSchema);
