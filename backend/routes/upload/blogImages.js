const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const uniqid = require('uniqid');
require('dotenv').config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Image upload route for blog images
router.post('/blog-images', upload.array('files', 5), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const uploadedImageNames = [];

    for (const file of files) {
      const { originalname, mimetype, buffer } = file;
      const id = uniqid();
      const ext = originalname.split('.').slice(-1)[0];
      const newName = `${id}.${ext}`;

      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: newName,
        Body: buffer,
        ContentType: mimetype,
        ACL: process.env.AWS_S3_ACL || 'private',
      });

      await s3Client.send(uploadCommand);
      uploadedImageNames.push(newName);
    }

    return res.status(200).json({ uploadedImages: uploadedImageNames });
  } catch (error) {
    console.error('Error uploading files to S3:', error);
    return res.status(500).json({ message: 'Failed to upload images' });
  }
});

module.exports = router;
