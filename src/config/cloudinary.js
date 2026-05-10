const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName = 'husode';
    let format = file.mimetype.split('/')[1];
    let resource_type = 'auto';

    if (file.mimetype.startsWith('video/')) {
      return {
        folder: `${folderName}/videos`,
        resource_type: 'video',
        format: 'mp4',
        eager: [
          { width: 1280, height: 720, crop: 'limit', format: 'mp4', video_codec: 'h264' }
        ],
        eager_async: true,
      };
    } else {
      return {
        folder: `${folderName}/images`,
        format: 'webp',
        width: 1920,
        crop: 'limit',
        quality: 'auto:best',
        fetch_format: 'auto'
      };
    }
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for videos
});

module.exports = { cloudinary, upload };
