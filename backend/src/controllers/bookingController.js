import Booking from '../models/Booking.js';
import EventOwner from '../models/EventOwnerDetails.js';

export const createBooking = async (req, res) => {
  try {
    const { eventOwnerId, eventDate, totalAmount, commission, paymentStatus, paymentId } = req.body;

    const userId = req.user.id;

    const isAlreadyBooked = await Booking.findOne({ userId, eventOwnerId, eventDate });
    if (isAlreadyBooked) {
      return res.status(400).json({ message: 'You have already booked this event' });
    }

    // Check if the event owner exists
    const eventOwner = await EventOwner.findById(eventOwnerId);
    if (!eventOwner) {
      return res.status(404).json({ message: 'Event owner not found' });
    }

    // Convert the eventDate to a Date object
    const eventBookingDate = new Date(eventDate);
    eventBookingDate.setUTCHours(0, 0, 0, 0);  // Normalize to midnight UTC
    console.log('Booking Date:', eventBookingDate);  // Debugging: Log the booking date

    // Check if the event owner has availability for the selected date
    let isAvailable = false;

    // Search for the availability of the requested eventDate
    const availabilityIndex = eventOwner.availability.findIndex((availability) => {
      const availabilityDate = new Date(availability.date);
      availabilityDate.setUTCHours(0, 0, 0, 0);  // Normalize to midnight UTC
      console.log('Checking Availability Date:', availabilityDate);  // Debugging: Log the availability date

      // If the availability exists and is available, set it to true
      return availabilityDate.getTime() === eventBookingDate.getTime();
    });

    // If date is available, mark it unavailable and create the booking
    if (availabilityIndex !== -1) {
      const availability = eventOwner.availability[availabilityIndex];
      if (availability.isAvailable === true) {
        isAvailable = true;
      }
    } else {
      // If the date is not present in the availability, consider it available by default
      isAvailable = true;
    }

    // If the date is available, create the booking
    if (isAvailable) {
      // If the date was not in the availability list, we need to add it as unavailable now that it's booked
      if (availabilityIndex === -1) {
        eventOwner.availability.push({
          date: eventBookingDate,
          isAvailable: false,  // Mark this newly added date as unavailable after booking
        });
      } else {
        // If the date was already in the availability, just mark it unavailable
        eventOwner.availability[availabilityIndex].isAvailable = false;
      }

      // Save the updated eventOwner availability
      await eventOwner.save();

      // Proceed with creating the booking
      const newBooking = new Booking({
        userId,
        eventOwnerId,
        eventDate,
        totalAmount,
        commission,
        paymentStatus,
        paymentId,
      });

      await newBooking.save();
      res.status(201).json(newBooking);
    } else {
      return res.status(400).json({ message: 'The event owner is not available on this date.' });
    }
  } catch (error) {
    console.error(error);  // Debugging: Log error details
    res.status(400).json({ message: error.message });
  }
};



// In bookingController.js

export const getBookingsByCustomer = async (req, res) => {
  try {
    // Get the logged-in customer’s userId from the JWT token
    const customerId = req.user.id;

    // Find all bookings where the userId matches the logged-in customer's userId
    const bookings = await Booking.find({ userId: customerId });

    // If no bookings are found for the customer
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this customer.' });
    }

    // Return the bookings for the logged-in customer
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve bookings.' });
  }
};


// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'username email')
      .populate('eventOwnerId', 'businessName businessType');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('eventOwnerId', 'businessName businessType');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a booking
export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('userId', 'username email')
      .populate('eventOwnerId', 'businessName businessType');
    if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
