const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const uniqid = require('uniqid');
require('dotenv').config();

// Setup multer for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Router
const router = express.Router();

// Image upload route for S3
router.post('/profile', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, buffer } = file;
    // console.log(originalname)

    // Setup AWS S3 Client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const id = uniqid();
    const ext = originalname.split('.').slice(-1)[0]; // Get the file extension
    const newName = id + '.' + ext; // Generate a unique file name

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: newName,
      Body: buffer,
      ContentType: mimetype,
      ACL: process.env.AWS_S3_ACL || 'private',
    });

    await s3Client.send(uploadCommand);    

    return res.status(200).json({ newName });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return res.status(500).json({ message: 'Failed to upload image' });
  }
});

module.exports = router;
