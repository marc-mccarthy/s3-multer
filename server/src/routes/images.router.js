const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const router = express.Router();
const multerS3 = require('multer-s3');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'my-bucket',
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname});
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString())
    }
  })
});

router.post('/', upload.single('image'), (req, res) => {
  // Handle upload
});

module.exports = router;
