const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);


// PUT CHUNKED UPLOAD
app.put('/upload-chunked/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  const writeStream = fs.createWriteStream(filePath);

  req.pipe(writeStream);

  req.on('end', () => {
    res.status(200).send({ message: 'Chunked upload complete', path: filePath });
  });

  req.on('error', (err) => {
    console.error(err);
    res.status(500).send('Chunked upload error');
  });
});


// PUT MULTIPART UPLOAD
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

app.put('/upload-multipart', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  res.status(200).send({ message: 'Multipart upload complete', path: req.file.path });
});


app.listen(PORT, () => {
  console.log(`Server running at http://000.000.0.00:${PORT}`);
});
