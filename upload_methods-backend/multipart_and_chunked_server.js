/**
 * Server handling multipart form uploads and chunked file uploads
 * @module MultipartChunkedServer
 */

const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

/**
 * Upload directory configuration
 * @type {string}
 */
const uploadDir = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/**
 * PUT endpoint for chunked file uploads
 * @name PUT/upload-chunked/:filename
 * @param {string} filename - Route parameter specifying destination filename
 * @returns {Object} JSON response with upload status
 * @returns {string} Object.message - Upload status message
 * @returns {string} Object.path - Path to saved file
 */
app.put('/upload-chunked/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  const writeStream = fs.createWriteStream(filePath);

  // Stream the incoming request to file
  req.pipe(writeStream);

  req.on('end', () => {
    res.status(200).send({ 
      message: 'Chunked upload complete', 
      path: filePath 
    });
  });

  req.on('error', (err) => {
    console.error(err);
    res.status(500).send('Chunked upload error');
  });
});

/**
 * Multer storage configuration for multipart uploads
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

/**
 * PUT endpoint for multipart file uploads
 * @name PUT/upload-multipart
 * @param {File} file - Multipart form file (field name: 'file')
 * @returns {Object} JSON response with upload status
 * @returns {string} Object.message - Upload status message
 * @returns {string} Object.path - Path to saved file
 */
app.put('/upload-multipart', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.status(200).send({ 
    message: 'Multipart upload complete', 
    path: req.file.path 
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});