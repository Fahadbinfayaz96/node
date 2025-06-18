/**
 * Server for generating presigned S3 URLs for direct uploads
 * @module DirectPresignedServer
 */

const express = require('express');
const { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const cors = require('cors');

const app = express();
app.use(cors());

/**
 * S3 Client configuration
 * @type {S3Client}
 */
const s3 = new S3Client({
  endpoint: 'http://localhost:4566', // LocalStack endpoint
  region: 'us-east-1',
  forcePathStyle: true,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
});

const BUCKET_NAME = 'test-bucket';

/**
 * Ensures the S3 bucket exists, creates it if it doesn't
 * @async
 * @function ensureBucketExists
 * @param {string} bucketName - Name of the S3 bucket
 * @throws {Error} If bucket creation fails
 */
async function ensureBucketExists(bucketName) {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket "${bucketName}" already exists.`);
  } catch (err) {
    if (err.name === 'NotFound') {
      await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`Bucket "${bucketName}" created.`);
    } else {
      throw err;
    }
  }
}

// Initialize bucket on startup
ensureBucketExists(BUCKET_NAME).catch(console.error);

/**
 * GET endpoint to generate presigned URL
 * @name GET/generate-presigned-url
 * @param {string} key - Query parameter specifying the object key
 * @returns {Object} JSON response containing the presigned URL
 * @returns {string} Object.url - Presigned URL for direct upload
 */
app.get('/generate-presigned-url', async (req, res) => {
  const key = req.query.key;
  const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key });
  
  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 900 }); // 15 minute expiry
    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));