import jwt from 'jsonwebtoken';

// Function to generate JWT token
export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Function to send the token in cookies
export const sendTokenInCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,    // Token is not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // Secure flag for HTTPS
    sameSite: 'Strict', // Protect against CSRF
    maxAge: 24 * 60 * 60 * 1000, // Token expiration time (1 day)
  });
};

