
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// async function uploadBufferToS3(buffer, filename, mimetype, folder) {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: folder,
//         resource_type: 'auto',
//         public_id: `${Date.now()}_${filename}`,
//         format: 'pdf'
//       },
//       (error, result) => {
//         if (error) {
//           console.error('Cloudinary upload error:', error);
//           reject(error);
//         } else {
//           resolve(result.secure_url);
//         }
//       }
//     );
//     uploadStream.end(buffer);
//   });
// }

// module.exports = { uploadBufferToS3 };
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload buffer to Cloudinary (Public Access)
 * @param {Buffer} buffer - File buffer
 * @param {String} filename - Original filename
 * @param {String} mimetype - File mimetype
 * @param {String} folder - Folder to store in Cloudinary
 * @returns {Promise<String>} - URL of uploaded file
 */
async function uploadBufferToS3(buffer, filename, mimetype, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || 'cvs',
        resource_type: 'raw', // Use 'raw' for PDFs
        public_id: `${Date.now()}_${filename.replace(/\.[^/.]+$/, '')}`,
        use_filename: false,
        unique_filename: true,
        overwrite: false,
        invalidate: true
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          console.log('✅ File uploaded to Cloudinary:', result.secure_url);
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Public ID of the file to delete
 * @returns {Promise<Object>} - Deletion result
 */
async function deleteFromS3(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

module.exports = { 
  uploadBufferToS3,
  deleteFromS3
};