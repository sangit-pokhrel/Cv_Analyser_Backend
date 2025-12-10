const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const fileFilter = (allowedExts) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExts.includes(ext)) {
    return cb(new Error('File type not allowed'), false);
  }
  cb(null, true);
};

const uploadCV = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter(['.pdf', '.doc', '.docx'])
});


const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter(['.jpg', '.jpeg', '.png', '.webp'])
});

module.exports = { uploadCV, uploadImage };
