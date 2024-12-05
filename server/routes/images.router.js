const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const pool = require('../config/database');
require('dotenv').config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const s3Client = new S3Client({ region: process.env.AWS_REGION });

router.post('/uploadImage', upload.array('files'), async (req, res) => {
  try {
    const uploadResults = await Promise.all(
      req.files.map(async (file) => {
        // Generate a unique file name using the current date and time
        const date = new Date();
        const dateString = date.toISOString().replace(/:/g, '-').replace(/\./g, '-');
        const key = `uploads/${dateString}-${file.originalname}`;
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        await s3Client.send(command);
        const imageUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        const dbResponse = await pool.query(
          'INSERT INTO images(name, url) VALUES($1, $2) RETURNING *',
          [file.originalname, imageUrl]
        );

        return dbResponse.rows[0];
      })
    );

    res.json({ message: "Images uploaded successfully", images: uploadResults });
  } catch (err) {
    console.error("Error uploading to S3 or saving to database", err);
    res.status(500).send("Error processing your request");
  }
});

router.get('/getAllImages', async (_req, res) => {
  try {
    const queryText = 'SELECT name, url FROM images ORDER BY id DESC';
    const { rows } = await pool.query(queryText);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching images from the database", err);
    res.status(500).send("Error fetching images from the database");
  }
});

module.exports = router;
