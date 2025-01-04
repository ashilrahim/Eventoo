import User from '../models/User.js';
import EventOwner from '../models/EventOwnerDetails.js';
import Booking from '../models/Booking.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Get all event owners
export const getAllEventOwners = async (req, res) => {
  try {
    const eventOwners = await EventOwner.find()
      .populate('userId', 'username email'); // Populate user info
    res.status(200).json(eventOwners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Approve or reject an event owner
export const updateEventOwnerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const eventOwner = await EventOwner.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!eventOwner) {
      return res.status(404).json({ message: 'Event owner not found' });
    }

    res.status(200).json(eventOwner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an event owner
export const deleteEventOwner = async (req, res) => {
  try {
    const eventOwner = await EventOwner.findByIdAndDelete(req.params.id);
    if (!eventOwner) {
      return res.status(404).json({ message: 'Event owner not found' });
    }

    res.status(200).json({ message: 'Event owner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  
