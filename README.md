📦 File Upload Backend Service
This Node.js backend service demonstrates three different file upload methods, suitable for modern applications:

🚀 Features
1. Direct Upload with Presigned URLs Secure client-side uploads to S3-compatible storage(localstack).
3. Multipart Upload Traditional form-based uploads via HTML forms or HTTP clients.
4. Chunked Upload Efficient streaming of large files in smaller chunks.

🧰 Prerequisites
. Node.js (v14 or higher)
. npm or yarn
. LocalStack (for local S3 emulation) or AWS credentials (for real S3)

📦 Installation
git clone https://github.com/yourusername/upload-methods-backend.git
cd upload-methods-backend
npm install

⚙️ Configuration
S3 Setup (in direct_presigned_server.js)
Edit your credentials and endpoint as needed:

const s3 = new S3Client({
  endpoint: 'http://localhost:4566', // Change local host to your device ip
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'your-access-key',
    secretAccessKey: 'your-secret-key',
  },
});
Upload Directory
Multipart and chunked uploads are saved to the ./uploads directory. The directory is auto-created if it doesn't exist.


▶️ Running the Server

# Start the direct upload server
node direct_presigned_server.js

# Start the multipart & chunked upload server
node multipart_and_chunked_server.js


📡 API Endpoints
🔐 Direct Upload (Presigned URL)
GET /generate-presigned-url

Query Parameters:

. key (string, required) – Desired filename in S3
{
  "url": "https://s3.amazonaws.com/yourbucket/yourfile?..."
}

🧾 Multipart Upload
PUT /upload-multipart
Content-Type: multipart/form-data
Form Field: file

Response: {
  "message": "Multipart upload complete",
  "path": "/uploads/filename.ext"
}


📤 Chunked Upload
PUT /upload-chunked/:filename
Streams incoming file data in chunks.

Response: {
  "message": "Chunked upload complete",
  "path": "/uploads/filename.ext"
}




