import Booking from "../models/Booking.js";
import EventOwner from "../models/EventOwnerDetails.js";

export const createBooking = async (req, res) => {
  try {
    const { eventOwnerId, eventDates, Days, paymentStatus, paymentId } =
      req.body;
    const userId = req.user._id;

    eventDates.sort((a, b) => new Date(a) - new Date(b));

    // Validate user-selected dates
    if (!Array.isArray(eventDates) || eventDates.length !== Days) {
      return res
        .status(400)
        .json({ message: `You must select exactly ${Days} dates.` });
    }

    // Check if the event owner exists and is approved
    const eventOwner = await EventOwner.findById(eventOwnerId);
    if (!eventOwner || eventOwner.status !== "approved") {
      return res
        .status(404)
        .json({ message: "Event owner not found or not approved." });
    }

    // Validate all selected dates are in the future
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    for (const date of eventDates) {
      if (new Date(date) < today) {
        return res
          .status(400)
          .json({ message: `Date ${date} must be in the future.` });
      }
    }

     // Check availability for all selected dates
     for (const date of eventDates) {
      const availabilityEntry = eventOwner.availability.find((availability) => {
        const availabilityDate = new Date(availability.date);
        availabilityDate.setUTCHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setUTCHours(0, 0, 0, 0);
        return availabilityDate.getTime() === selectedDate.getTime();
      });

      // If the date exists in availability and is not available, throw an error
      if (availabilityEntry && !availabilityEntry.isAvailable) {
        return res.status(400).json({ message: `Date ${date} is not available for booking.` });
      }
    }

    // Update availability or add new entries for selected dates
    for (const date of eventDates) {
      const availabilityIndex = eventOwner.availability.findIndex((availability) => {
        const availabilityDate = new Date(availability.date);
        availabilityDate.setUTCHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setUTCHours(0, 0, 0, 0);
        return availabilityDate.getTime() === selectedDate.getTime();
      });

      if (availabilityIndex !== -1) {
        // Update existing availability entry
        eventOwner.availability[availabilityIndex].isAvailable = false;
      } else {
        // Add new availability entry
        eventOwner.availability.push({
          date: new Date(date),
          isAvailable: false,
        });
      }
    }

    // Save the updated eventOwner availability
    await eventOwner.save();

    // Calculate total amount
    const totalAmount = eventOwner.pricing.basePrice * Days;

    // Create the booking
    const newBooking = new Booking({
      userId,
      eventOwnerId,
      eventDates, // Save the selected dates
      Days,
      totalAmount,
      paymentStatus,
      paymentId,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// In bookingController.js

export const getBookingsByCustomer = async (req, res) => {
  try {
    // Get the logged-in customer’s userId from the JWT token
    const customerId = req.user._id;

    // Find all bookings where the userId matches the logged-in customer's userId
    const bookings = await Booking.find({ userId: customerId });

    // If no bookings are found for the customer
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this customer." });
    }

    // Return the bookings for the logged-in customer
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve bookings." });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "username email")
      .populate("eventOwnerId", "businessName businessType");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "username email")
      .populate("eventOwnerId", "businessName businessType");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { eventDates, Days } = req.body;

    // Validate eventDates and Days
    if (!eventDates || !Array.isArray(eventDates) || eventDates.length === 0) {
      return res
        .status(400)
        .json({ message: "You must provide an array of event dates." });
    }

    // Sort the eventDates
    eventDates.sort((a, b) => new Date(a) - new Date(b));

    // Check the number of dates matches Days
    if (eventDates.length !== Days) {
      return res
        .status(400)
        .json({ message: `You must select exactly ${Days} dates.` });
    }

    // Find the booking
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Find the associated event owner
    const eventOwner = await EventOwner.findById(booking.eventOwnerId);
    if (!eventOwner || eventOwner.status !== "approved") {
      return res
        .status(404)
        .json({ message: "Event owner not found or not approved." });
    }

    // Check availability for all selected dates
    for (const date of eventDates) {
      const availabilityEntry = eventOwner.availability.find((availability) => {
        const availabilityDate = new Date(availability.date);
        availabilityDate.setUTCHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setUTCHours(0, 0, 0, 0);
        return availabilityDate.getTime() === selectedDate.getTime();
      });

      if (availabilityEntry && !availabilityEntry.isAvailable) {
        return res
          .status(400)
          .json({ message: `Date ${date} is not available for booking.` });
      }
    }

    // Release previously booked dates
    for (const date of booking.eventDates) {
      const availabilityIndex = eventOwner.availability.findIndex(
        (availability) => {
          const availabilityDate = new Date(availability.date);
          availabilityDate.setUTCHours(0, 0, 0, 0);
          const bookedDate = new Date(date);
          bookedDate.setUTCHours(0, 0, 0, 0);
          return availabilityDate.getTime() === bookedDate.getTime();
        }
      );

      if (availabilityIndex !== -1) {
        eventOwner.availability[availabilityIndex].isAvailable = true;
      }
    }

    // Update availability for the new booking dates
    for (const date of eventDates) {
      const availabilityIndex = eventOwner.availability.findIndex(
        (availability) => {
          const availabilityDate = new Date(availability.date);
          availabilityDate.setUTCHours(0, 0, 0, 0);
          const selectedDate = new Date(date);
          selectedDate.setUTCHours(0, 0, 0, 0);
          return availabilityDate.getTime() === selectedDate.getTime();
        }
      );

      if (availabilityIndex !== -1) {
        eventOwner.availability[availabilityIndex].isAvailable = false;
      } else {
        eventOwner.availability.push({
          date: new Date(date),
          isAvailable: false,
        });
      }
    }

    // Save the updated availability
    await eventOwner.save();

    // Update the booking fields
    booking.eventDates = eventDates;
    booking.Days = Days;
    booking.totalAmount = eventOwner.pricing.basePrice * Days;
    await booking.save();

    // Populate the updated booking with related information
    const updatedBooking = await Booking.findById(req.params.id)
      .populate("userId", "username email")
      .populate("eventOwnerId", "businessName businessType");

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a booking and remove dates from event owner availability
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Find the event owner and remove dates from availability
    const eventOwner = await EventOwner.findById(booking.eventOwnerId);
    if (eventOwner) {
      // Remove all booked dates from availability array
      eventOwner.availability = eventOwner.availability.filter(availability => {
        const availabilityDate = new Date(availability.date);
        availabilityDate.setUTCHours(0, 0, 0, 0);
        
        return !booking.eventDates.some(bookedDate => {
          const date = new Date(bookedDate);
          date.setUTCHours(0, 0, 0, 0);
          return date.getTime() === availabilityDate.getTime();
        });
      });

      await eventOwner.save();
    }

    await booking.deleteOne();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
