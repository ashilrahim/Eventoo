import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  eventOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventOwner', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  averageRating: { type: Number, default: 0 },// Calculated average of ratings
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', reviewSchema);