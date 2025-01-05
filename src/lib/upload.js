import multer from 'multer';
import path from 'path';

// Set up storage options for multer
const storage = multer.diskStorage({
    // Destination where files will be stored
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // This is the folder where files will be saved
    },
    // Create a unique file name based on the current timestamp
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Adds a timestamp to the file name
    }
});

// Create an upload instance with the specified storage settings
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Set a file size limit (10 MB in this case)
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed image types
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Invalid file type. Only .jpg, .png, and .gif are allowed.'));
        }
    }
});

export default upload;
