const express = require('express');
const { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const cors = require('cors');

const app = express();
app.use(cors());

const s3 = new S3Client({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  forcePathStyle: true,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
});

const BUCKET_NAME = 'test-bucket';

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

ensureBucketExists(BUCKET_NAME).catch(console.error);

app.get('/generate-presigned-url', async (req, res) => {
  const key = req.query.key;
  const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key });
  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 900 });
    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://192.168.1.17:${PORT}`));
