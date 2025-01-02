// models/EventOwner.js
import mongoose from 'mongoose';

const eventOwnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  description: String,
  pricing: {
    basePrice: Number,
    currency: { type: String, default: 'USD' }
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String
  },
  capacity: { type: Number, required: true }, // How many people the venue can host
  availability: [{
    date: { type: Date, required: true }, // Specific date
    isAvailable: { type: Boolean, default: true } // Availability status
  }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked to the user/customer leaving the review
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 } // Calculated average of ratings
});

export default mongoose.model('EventOwner', eventOwnerSchema);
