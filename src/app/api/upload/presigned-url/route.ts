import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PreSignedUrlRequest, PreSignedUrlResponse } from '@/types/upload';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: PreSignedUrlRequest = await request.json();
    const { fileName, fileType, fileSize, documentType, folderPath } = body;

    // Validate required fields
    if (!fileName || !fileType || !fileSize || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate document type (now accepts any string)
    if (!documentType || typeof documentType !== 'string' || documentType.trim() === '') {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    // Generate S3 key with organized folder structure
    const timestamp = Date.now();
    const baseFolder = folderPath || 'uploads'; // Use custom folder or default to 'uploads'
    const s3Key = `${baseFolder}/${documentType}/${timestamp}_${fileName}`;

    // Create PutObject command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: s3Key,
      ContentType: fileType,
      ContentLength: fileSize,
      // Add metadata for better organization
      Metadata: {
        documentType,
        originalFileName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Generate pre-signed URL (expires in 1 hour)
    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600 // 1 hour
    });

    // Construct the final file URL
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const response: PreSignedUrlResponse = {
      uploadUrl,
      fileUrl,
      expiresIn: 3600,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
