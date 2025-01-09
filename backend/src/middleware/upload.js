import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinaryConfig from "../config/cloudinary.js"; // Adjust the path as necessary

// Configure Cloudinary
cloudinary.config(cloudinaryConfig);

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'eventImages', // Folder name in Cloudinary
        format: (req, file) => ['jpg', 'jpeg', 'png'].includes(file.mimetype.split('/')[1]) ? file.mimetype.split('/')[1] : 'jpg', // Supports promises as well
        public_id: (req, file) => file.originalname.split('.')[0], // Use the original file name as the public id
    },
});

// Multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).array('eventImages', 10); // Accept up to 10 images

// Middleware function
const uploadImages = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }
        console.log("Uploaded files:", req.files);
        next();
    });
};

export default uploadImages;
