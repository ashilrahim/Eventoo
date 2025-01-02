// // controllers/userController.js
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// export const registerUser = async (req, res) => {
//   try {
//     const { username, email, password, contactNumber } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       contactNumber,
//       role: 'user'
//     });

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(400).json({ message: 'Invalid password' });
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const logout = (req, res) => {
//     try {
//       res.cookie("jwt", "", { maxAge: 0 });
//       res.status(200).json({ message: "Logged out Successfully" });
//     } catch (error) {
//       console.log("Error in Logout Controller", error.message);
//       res.status(500).json({ message: "Internal Server Error " });
//     }
//   };

// export const checkAuth = (req, res) => {
//     try {
//       res.status(200).json(req.user);
//     } catch (error) {
//       console.log("Error in checkAuth controller", error.message);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };