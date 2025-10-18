# S3 Upload Setup Guide

This guide explains how to set up the AWS S3 upload system for your Next.js application.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Environment Variables

Create a `.env.local` file in your frontend project root:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name
```

### 3. AWS S3 Bucket Setup

1. **Create S3 Bucket** in AWS Console
2. **Configure CORS Policy**:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "ExposeHeaders": ["ETag", "x-amz-request-id"]
  }
]
```

3. **Create IAM User** with S3 permissions
4. **Get Access Keys** and add to environment variables

## 📋 How It Works

### Upload Flow:
1. **User selects image** (PAN/Aadhaar) on frontend
2. **Frontend calls Next.js API Route** (`/api/upload/presigned-url`) to get pre-signed S3 URL
3. **Backend (API route) generates pre-signed URL** via AWS SDK
4. **Frontend uploads directly to S3** using that URL
5. **File URL is stored in state** for KYC submission

### Security Features:
- ✅ AWS credentials never exposed to frontend
- ✅ Pre-signed URLs expire after 1 hour
- ✅ File validation (size, type, extension)
- ✅ Organized file storage by document type
- ✅ Direct S3 upload (no backend bottleneck)

## 🎯 Usage

The S3 upload system is now integrated into the KYC page. Users can:

- **Drag & drop** files or click to select
- **See real-time upload progress**
- **Preview images** before upload
- **Retry failed uploads**
- **Get validation errors** for invalid files

## 📁 File Organization

Files are stored in S3 with this structure:
```
your-bucket/
├── kyc-documents/
│   ├── pan/
│   ├── aadhar_front/
│   ├── aadhar_back/
│   ├── gst/
│   └── bank/
```

## 🔧 API Endpoints

### POST `/api/upload/presigned-url`

**Request:**
```json
{
  "fileName": "pan_1703123456789_abc123.jpg",
  "fileType": "image/jpeg",
  "fileSize": 2048576,
  "documentType": "pan"
}
```

**Response:**
```json
{
  "uploadUrl": "https://your-bucket.s3.amazonaws.com/...",
  "fileUrl": "https://your-bucket.s3.amazonaws.com/...",
  "expiresIn": 3600
}
```

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**: Check S3 bucket CORS policy
2. **Access Denied**: Verify IAM permissions
3. **File Not Found**: Check bucket name and region
4. **Upload Fails**: Verify file size limits and network

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test S3 permissions with AWS CLI
4. Check Next.js API route logs

## 🎉 Ready to Use!

Once you've completed the setup:
1. Start your development server: `npm run dev`
2. Navigate to the KYC page
3. Try uploading documents
4. Check your S3 bucket for uploaded files

The system is now ready for production use! 🚀
