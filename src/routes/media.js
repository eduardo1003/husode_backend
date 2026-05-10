const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { Image, Video } = require('../models');
const authMiddleware = require('../middlewares/auth');

// Upload single or multiple medias
// We use dynamic types (image/video) via multer config. We just accept an array of files.
router.post('/upload', authMiddleware, upload.array('files', 10), async (req, res) => {
  try {
    const uploadedFiles = req.files;
    const { projectId, eventId, newsId, album = 'general', title = '' } = req.body;

    const savedMedia = [];

    for (let file of uploadedFiles) {
      if (file.mimetype.startsWith('video/')) {
        const vid = await Video.create({
          url: file.path, // Cloudinary URL
          public_id: file.filename,
          title: title,
          album: album,
          projectId: projectId || null,
          eventId: eventId || null
        });
        savedMedia.push(vid);
      } else {
        const img = await Image.create({
          url: file.path,
          public_id: file.filename,
          album: album,
          title: title,
          projectId: projectId || null,
          eventId: eventId || null,
          newsId: newsId || null
        });
        savedMedia.push(img);
      }
    }

    res.status(200).json({ message: 'Files uploaded successfully', data: savedMedia });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Error uploading files' });
  }
});

// Get all media for gallery
router.get('/', async (req, res) => {
  try {
    const images = await Image.findAll();
    const videos = await Video.findAll();
    res.json({ images, videos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching media' });
  }
});

// Delete media
router.delete('/:type/:id', authMiddleware, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { cloudinary } = require('../config/cloudinary');
    
    let mediaItem;
    if (type === 'image') {
      mediaItem = await Image.findByPk(id);
    } else if (type === 'video') {
      mediaItem = await Video.findByPk(id);
    }

    if (!mediaItem) return res.status(404).json({ message: 'Media not found' });

    // Remove from cloudinary
    if (type === 'video') {
       await cloudinary.uploader.destroy(mediaItem.public_id, { resource_type: 'video' });
    } else {
       await cloudinary.uploader.destroy(mediaItem.public_id);
    }

    // Remove from DB
    await mediaItem.destroy();

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting media' });
  }
});

module.exports = router;
