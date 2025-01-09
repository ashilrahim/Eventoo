import mongoose from "mongoose";
import EventOwner from "../models/EventOwnerDetails.js";
/**
 * Create a new Event Owner
 */
export const createEventOwner = async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      description,
      pricing,
      location,
      capacity,
      availability, // Default to an empty array if no availability is provided
    } = req.body;

    // console.log("req.user in createEventOwner:", req.user);
    const userId = req.user._id;

    console.log(userId);
    // Check if the user is already registered as an EventOwner
    const existingEventOwner = await EventOwner.findOne({ userId });

    if (existingEventOwner) {
      return res.status(400).json({
        success: false,
        message: "You have already registered as an event owner.",
      });
    }

    // Check if the userId exists (e.g., logged-in user)
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Validate that required fields are present
    if (!businessName || !businessType || !pricing) {
      return res.status(400).json({
        success: false,
        message: "Business name, type, capacity, and pricing are required",
      });
    }

    const imageUrls = req.files ? req.files.map((file) => file.path) : [];
    console.log("Files received in createEventOwner:", req.files);
    console.log("Image URLs:", imageUrls);

    // Default availability to an empty array if not provided
    const eventAvailability = Array.isArray(availability) ? availability : [];

    if (availability) {
      try {
        // If availability is a stringified JSON, parse it
        eventAvailability = typeof availability === "string"
          ? JSON.parse(availability)
          : availability;

        // Normalize the availability data
        eventAvailability = eventAvailability.map((avail) => {
          const parsedDate = new Date(avail.date);

          if (isNaN(parsedDate)) {
            throw new Error(`Invalid date format in availability: ${avail.date}`);
          }

          return {
            date: parsedDate, // Ensure the date is a Date object
            isAvailable: avail.isAvailable || false, // Default to false if not provided
          };
        });
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid availability format. Must be an array of objects.",
          error: err.message,
        });
      }
    }
    // Create new EventOwner
    const newEventOwner = new EventOwner({
      userId,
      businessName,
      businessType,
      description,
      pricing,
      location,
      capacity,
      availability: normalizedAvailability,
      eventImages: imageUrls,
    });

    await newEventOwner.save();

    res.status(201).json({ success: true, data: newEventOwner });
  } catch (error) {
    console.error("Error creating event owner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event owner",
      error: error.message,
    });
  }
};

/**
 * Get all registered Event Owners
 */
export const getAllEventOwners = async (req, res) => {
  try {
    // Fetch event owners with status 'approved' only
    const eventOwners = await EventOwner.find({ status: "approved" })
      .populate("userId", "name email") // Populate user details
      .populate("reviews.userId", "name"); // Populate reviewer details

    // Respond with event owners
    res.status(200).json({ success: true, data: eventOwners });
  } catch (error) {
    console.error("Error fetching event owners:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch event owners", error });
  }
};

export const getEventOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    let query = { _id: id };

    // Log the incoming query
    console.log("Initial Query: ", query);

    // Check if the user is an admin or the owner of the business
    const isOwner = await EventOwner.findOne({
      _id: id,
      userId: req.user?._id,
    });

    if (!req.user?.admin && !isOwner) {
      // For regular users who are not the owner, only show approved businesses
      query.status = "approved";
    }

    console.log("Final Query: ", query);

    const eventOwner = await EventOwner.findOne(query)
      .populate("userId", "name email")
      .populate("reviews", "rating comment userId") // Ensure reviews are populated correctly
      .populate("reviews.userId", "name email");

    console.log("Event Owner:", eventOwner);

    if (!eventOwner) {
      return res.status(404).json({
        success: false,
        message: "Event Owner not found",
      });
    }

    res.status(200).json({ success: true, data: eventOwner });
  } catch (error) {
    console.error("Error fetching event owner:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch event owner", error });
  }
};

/**
 * Update Event Owner details
 */
export const updateEventOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // Check if the user is the owner of the event
    const eventOwner = await EventOwner.findById(id);
    if (req.user._id.toString() !== eventOwner.userId.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only update your own business.",
      });
    }

    // Parse and normalize availability if provided
    if (updatedData.availability) {
      try {
        let availability = typeof updatedData.availability === 'string' 
          ? JSON.parse(updatedData.availability) 
          : updatedData.availability;

        updatedData.availability = availability.map(avail => ({
          date: new Date(avail.date),
          isAvailable: avail.isAvailable || false
        }));
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid availability format",
          error: err.message
        });
      }
    }

    // Update event images if provided
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);
      updatedData.eventImages = imageUrls;
    }

    const updatedEventOwner = await EventOwner.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedEventOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Event Owner not found" });
    }

    res.status(200).json({ success: true, data: updatedEventOwner });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update event owner", error });
  }
};

// Delete the event owner details

export const deleteEventOwner = async (req, res) => {
  
}
