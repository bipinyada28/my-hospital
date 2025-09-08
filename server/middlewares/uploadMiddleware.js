import multer from 'multer';
import path from 'path';

// Define storage location and filename format
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder where files will be saved (create it if missing)
  },
  filename: function (req, file, cb) {
    // Append timestamp to avoid name collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer upload instance for single file uploads
const upload = multer({ storage });

export default upload;
