// import { catchAsync, AppError } from '../middleware/errorHandler.js';

// // middleware/errorHandler.js

// // Custom error class for API errors
// class ApiError extends Error {
//     constructor(statusCode, message) {
//         super(message);
//         this.statusCode = statusCode;
//         this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//         Error.captureStackTrace(this, this.constructor);
//     }
// }

// // Handle mongoose validation errors
// const handleValidationError = (err) => {
//     const errors = Object.values(err.errors).map(el => el.message);
//     return new ApiError(400, `Invalid input: ${errors.join('. ')}`);
// };

// // Handle mongoose duplicate key errors
// const handleDuplicateKeyError = (err) => {
//     const field = Object.keys(err.keyPattern)[0];
//     return new ApiError(400, `Duplicate ${field}. Please use another value`);
// };

// // Handle mongoose cast errors (invalid IDs)
// const handleCastError = (err) => {
//     return new ApiError(400, `Invalid ${err.path}: ${err.value}`);
// };

// // Handle JWT errors
// const handleJWTError = () => {
//     return new ApiError(401, 'Invalid token, please log in again');
// };

// // Handle JWT expired error
// const handleJWTExpiredError = () => {
//     return new ApiError(401, 'Your token has expired, please log in again');
// };

// // Main error handling middleware
// export const errorHandler = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     // Different error handling for development and production
//     if (process.env.NODE_ENV === 'development') {
//         // Development error response - send full error details
//         res.status(err.statusCode).json({
//             status: err.status,
//             error: err,
//             message: err.message,
//             stack: err.stack
//         });
//     } else {
//         // Production error response
//         let error = { ...err };
//         error.message = err.message;

//         // Handle specific error types
//         if (err.name === 'ValidationError') error = handleValidationError(err);
//         if (err.code === 11000) error = handleDuplicateKeyError(err);
//         if (err.name === 'CastError') error = handleCastError(err);
//         if (err.name === 'JsonWebTokenError') error = handleJWTError();
//         if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

//         // Send error response
//         if (error.isOperational) {
//             // Known operational errors
//             res.status(error.statusCode).json({
//                 status: error.status,
//                 message: error.message
//             });
//         } else {
//             // Unknown programming errors - don't leak error details
//             console.error('ERROR 💥:', error);
//             res.status(500).json({
//                 status: 'error',
//                 message: 'Something went wrong!'
//             });
//         }
//     }
// };

// // Async handler wrapper to catch errors
// export const catchAsync = (fn) => {
//     return (req, res, next) => {
//         Promise.resolve(fn(req, res, next)).catch(next);
//     };
// };

// // 404 handler middleware
// export const notFound = (req, res, next) => {
//     const error = new ApiError(404, `Not found - ${req.originalUrl}`);
//     next(error);
// };

// // Rate limit error handler
// export const handleTooManyRequests = (req, res) => {
//     res.status(429).json({
//         status: 'error',
//         message: 'Too many requests from this IP, please try again later'
//     });
// };

// // Export the ApiError class for use in other files
// export const AppError = ApiError;