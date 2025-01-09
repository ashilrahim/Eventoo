// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import userRoutes from "./routes/userRoutes.js";
import eventOwnerRoutes from "./routes/eventOwnerRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import adminroutes from "./routes/adminRoutes.js"
// import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/event-owners', eventOwnerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminroutes);

// Error Handler
// app.use(errorHandler);
// // Handle 404 errors
// app.use(notFound);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
