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

    const userId = req.user.id;

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
    if (!businessName || !businessType || !capacity || !pricing) {
      return res.status(400).json({
        success: false,
        message: "Business name, type, capacity, and pricing are required",
      });
    }

    // Default availability to an empty array if not provided
    const eventAvailability = availability || [];

     // Normalize availability dates if provided
     const normalizedAvailability = availability.map((avail) => ({
      date: new Date(avail.date), // Ensure the date is in Date format
      isAvailable: avail.isAvailable, // true or false
    }));
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
    });

    await newEventOwner.save();

    res.status(201).json({ success: true, data: newEventOwner });
  } catch (error) {
    console.error("Error creating event owner:", error);
    res.status(500).json({ success: false, message: "Failed to create event owner", error: error.message });
  }
};


/**
 * Get all registered Event Owners
 */
export const getAllEventOwners = async (req, res) => {
  try {
    // Fetch event owners with status 'approved' only
    const eventOwners = await EventOwner.find({ status: 'approved' })
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

/**
 * Get a specific Event Owner by ID
 */
export const getEventOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const eventOwner = await EventOwner.findOne({ _id: id, status: 'approved' })
      .populate("userId", "name email")
      .populate("reviews.userId", "name");
    if (!eventOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Event Owner not found or not approved" });
    }
    res.status(200).json({ success: true, data: eventOwner });
  } catch (error) {
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
    const updatedData = req.body;

    const eventOwner = await EventOwner.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (req.user.id !== eventOwner.userId.toString()) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only update your own business.",
        });
    }
    if (!eventOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Event Owner not found" });
    }
    res.status(200).json({ success: true, data: eventOwner });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update event owner", error });
  }
};

