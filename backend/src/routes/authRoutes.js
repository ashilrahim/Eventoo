// routes/userRoutes.js
import express from "express";
import { checkAuth, login, logout, register } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post('/logout', logout); 
router.get("/check", authenticateToken, checkAuth);

export default router;
