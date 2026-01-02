import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOADS_FOLDER = 'uploads';
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER);

// Middleware factory for single or multiple files
export const uploadFile = (fieldName, maxCount = 5) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOADS_FOLDER);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    // Return middleware for multiple files
    return multer({ storage }).array(fieldName, maxCount);
};

// Convert uploaded file(s) to a URL
export const getFileUrl = (file) => {
    // For multiple files, Multer uses file.path
    return `${process.env.BASE_URL || 'http://localhost:5000'}/${file.path}`;
};
