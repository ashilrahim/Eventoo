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
    const { status } = req.query; // Optionally filter by status (e.g., 'approved')

    // Fetch event owners, optionally filtering by status if provided
    const query = status ? { status } : {};
    const eventOwners = await EventOwner.find(query)
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
    const eventOwner = await EventOwner.findById(id)
      .populate("userId", "name email")
      .populate("reviews.userId", "name");
    if (!eventOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Event Owner not found" });
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

/**
 * Delete an Event Owner
 */
export const deleteEventOwner = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEventOwner = await EventOwner.findByIdAndDelete(id);
    if (!deletedEventOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Event Owner not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Event Owner deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete event owner", error });
  }
};

/**
 * Add a Review to an Event Owner
 */
export const addReview = async (req, res) => {
  try {
    const { id } = req.params; // EventOwner ID
    const { userId, rating, comment } = req.body;

    const eventOwner = await EventOwner.findById(id);
    if (!eventOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Event Owner not found" });
    }

    eventOwner.reviews.push({ userId, rating, comment });
    eventOwner.averageRating =
      eventOwner.reviews.reduce((sum, review) => sum + review.rating, 0) /
      eventOwner.reviews.length;

    await eventOwner.save();
    res.status(201).json({ success: true, data: eventOwner });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to add review", error });
  }
};

/**
 * Update Event Owner Status
 */
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const eventOwner = await EventOwner.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!eventOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Event Owner not found" });
    }

    res.status(200).json({ success: true, data: eventOwner });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update status", error });
  }
};
