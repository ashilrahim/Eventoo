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
  capacity: { type: Number}, // How many people the venue can host
  availability: [{
    date: { type: Date, required: true }, // Specific date
    isAvailable: { type: Boolean, default: true } // Availability status
  }],
  eventImages: [{ type: String }], // Array of image URLs
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  
  
});

export default mongoose.model('EventOwner', eventOwnerSchema);
