const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const router = express.Router();
require('dotenv').config()

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const awsS3Bucket = process.env.S3_BUCKET

const storage = multer.memoryStorage();
const upload = multer({ storage });

// AWS S3
const s3 = new aws.S3({
	accessKeyId: awsAccessKeyId,
	secretAccessKey: awsSecretAccessKey,
});

router.post('/', upload.single('image'), async (req, res) => {
  const file = req.file;

  // Set S3 parameters
  const params = {
    Bucket: awsS3Bucket,
    Key: file.originalname,
    Body: file.buffer,
  };

  try {
    // Upload to S3
    const s3Result = await s3.upload(params).promise();
    
    // Get URL
    const url = s3Result.Location;

    // Insert into DB
    const query = 'INSERT INTO images (name, url) VALUES($1, $2) RETURNING *';
    const values = [originalname, url];
    const dbResult = await db.query(query, values);
    // Send back
    res.json(dbResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get('/', async (req, res) => {
	try {
		const result = await db.query('SELECT * FROM images ORDER BY id DESC');
		res.json(result.rows);
	} catch (err) {
		console.error(err.message);
	}
});

module.exports = router;
