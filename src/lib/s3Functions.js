import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';

const client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
  },
});

// Upload file to S3 bucket given file and path
const uploadFilesToS3 = async (file, path="") => {
  console.log("Uploading file to S3...", file);
  // Convert file to ArrayBuffer, then to Buffer
  const arrayBuffer = await file.arrayBuffer(); // Convert file to ArrayBuffer
  const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

  // Make path for file
  let objectKey = createHexPath(path);

  let contentType = file.type;
  if (file.type === "video/mp4") {
    contentType = "video/mp4"; // Correct MIME for MP4
    objectKey += ".mp4";
  } else if (file.type === "video/quicktime" || file.name.endsWith(".mov")) {
    objectKey += ".mov";
    contentType = "video/quicktime"; // Correct MIME for MOV (or QuickTime videos)
  }
  
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey,
    Body: buffer,
    ContentType: contentType,
  });

  try {
    const response = await client.send(command);
    return NextResponse.json({ objectKey: objectKey }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 },
    );
  }
};

// Given path to file, get image link from S3 bucket
const getPresignedUrl = async (objectKey) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME, // Your S3 bucket
    Key: objectKey, // Your file key (path to file)
  });

  if (!(await checkS3ObjectExists(objectKey))) {
    return '';
  }
  // Generate the signed URL (valid for 60 minutes)
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

  return signedUrl;
};

// Get file content NOT URLS from S3 bucket given objectKey
const getFilesFromS3 = async (objectKey) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey,
  });

  try {
    const response = await client.send(command);
    const str = await response.Body.transformToWebStream();
    return NextResponse.json({ data: str }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get file' }, { status: 500 });
  }
};

const deleteFilesFromS3 = async (objectKey) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey,
  });

  try {
    const response = await client.send(command);
    return NextResponse.json({ data: 'File deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 },
    );
  }
};

// Create random path for file
const createHexPath = (path = '') => {
  if (path[path.length - 1] !== '/' && path.length > 0) {
    path += '/';
  }
  return path + Math.random().toString(16).slice(2);
};

async function checkS3ObjectExists(objectKey) {
  const command = new HeadObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey,
  });

  try {
    // Use HeadObjectCommand to check if the object exists
    const response = await client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

// make hex given key
// get file given key
// delete file given key

export { uploadFilesToS3, getFilesFromS3, getPresignedUrl, deleteFilesFromS3 };
