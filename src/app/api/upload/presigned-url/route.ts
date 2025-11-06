import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PreSignedUrlRequest, PreSignedUrlResponse } from '@/types/upload';

// Function to get S3 client (initialized with validated credentials)
function getS3Client(region: string, accessKeyId: string, secretAccessKey: string) {
  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Validate AWS configuration
    const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!bucketName) {
      console.error('AWS S3 Bucket name is not configured. Check AWS_S3_BUCKET_NAME or S3_BUCKET_NAME environment variable.');
      return NextResponse.json(
        { error: 'S3 bucket configuration is missing. Please contact support.' },
        { status: 500 }
      );
    }

    if (!region) {
      console.error('AWS Region is not configured. Check AWS_REGION environment variable.');
      return NextResponse.json(
        { error: 'AWS region configuration is missing. Please contact support.' },
        { status: 500 }
      );
    }

    if (!accessKeyId || !secretAccessKey) {
      console.error('AWS credentials are not configured. Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
      return NextResponse.json(
        { error: 'AWS credentials are missing. Please contact support.' },
        { status: 500 }
      );
    }

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

    // Initialize S3 client with validated credentials
    const s3Client = getS3Client(region, accessKeyId, secretAccessKey);

    // Create PutObject command
    const command = new PutObjectCommand({
      Bucket: bucketName,
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
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;

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
