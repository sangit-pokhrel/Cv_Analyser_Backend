// // src/utils/storageS3.js  (AWS SDK v3)
// const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
// const { Upload } = require('@aws-sdk/lib-storage');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const { v4: uuidv4 } = require('uuid');

// const REGION = process.env.AWS_REGION;
// const BUCKET = process.env.S3_BUCKET;

// if (!REGION || !BUCKET) {
//   console.warn('WARNING: S3_BUCKET or AWS_REGION not set — storageS3 may not work until env variables are configured.');
// }

// const s3 = new S3Client({
//   region: REGION,
//   credentials: process.env.AWS_ACCESS_KEY_ID ? {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//   } : undefined
// });

// /**
//  * Upload a buffer to S3 and return the object URL (private) or signed URL (recommended).
//  * @param {Buffer} buffer
//  * @param {string} originalName
//  * @param {string} contentType
//  * @param {string} folder
//  * @returns {Promise<{ key: string, url: string }>}
//  */
// async function uploadBufferToS3(buffer, originalName, contentType, folder = 'uploads') {
//   const key = `${folder}/${Date.now()}-${uuidv4()}-${originalName}`;

//   // Use Upload from lib-storage to support multipart for large files
//   const upload = new Upload({
//     client: s3,
//     params: {
//       Bucket: BUCKET,
//       Key: key,
//       Body: buffer,
//       ContentType: contentType,
//       ACL: 'private'
//     }
//   });

//   await upload.done();

//   // return signed GET URL (expiring)
//   const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
//   // signed URL valid for 1 hour
//   const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

//   return { key, url };
// }


// async function getPresignedPutUrl(key, expiresIn = 300) {
//   const command = new PutObjectCommand({ Bucket: BUCKET, Key: key });
//   return await getSignedUrl(s3, command, { expiresIn });
// }

// module.exports = { uploadBufferToS3, getPresignedPutUrl };
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadBufferToS3(buffer, filename, mimetype, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        public_id: `${Date.now()}_${filename}`,
        format: 'pdf'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

module.exports = { uploadBufferToS3 };