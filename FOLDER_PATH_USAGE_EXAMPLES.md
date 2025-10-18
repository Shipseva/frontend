# Folder Path Usage Examples

## Overview
The S3 upload system now supports custom folder paths to organize files in your S3 bucket. You can specify different folder structures for different use cases.

## S3 Folder Structure
Files will be organized as: `{folderPath}/{documentType}/{timestamp}_{fileName}`

## Usage Examples

### 1. KYC Documents (Current Implementation)
```tsx
<S3FileUpload
  label="PAN Document"
  documentType="pan"
  folderPath="kyc"
  onChange={handleFileChange}
/>
```
**Result**: `kyc/pan/1703123456789_pan_document.pdf`

### 2. User Profile Images
```tsx
<S3FileUpload
  label="Profile Picture"
  documentType="profile"
  folderPath="users"
  accept="image/*"
  onChange={handleFileChange}
/>
```
**Result**: `users/profile/1703123456789_profile_picture.jpg`

### 3. Product Images
```tsx
<S3FileUpload
  label="Product Image"
  documentType="product"
  folderPath="products"
  accept="image/*"
  onChange={handleFileChange}
/>
```
**Result**: `products/product/1703123456789_product_image.jpg`

### 4. Company Documents
```tsx
<S3FileUpload
  label="Company Logo"
  documentType="logo"
  folderPath="companies"
  accept="image/*"
  onChange={handleFileChange}
/>
```
**Result**: `companies/logo/1703123456789_company_logo.png`

### 5. No Folder Path (Default)
```tsx
<S3FileUpload
  label="General Document"
  documentType="document"
  onChange={handleFileChange}
/>
```
**Result**: `uploads/document/1703123456789_document.pdf`

## API Usage

### Direct uploadFile function
```typescript
import { uploadFile } from '@/lib/upload';

// With custom folder
const result = await uploadFile(
  file, 
  'invoice', 
  onProgress, 
  'financial' // folderPath
);
// Result: financial/invoice/1703123456789_invoice.pdf

// Without folder (defaults to 'uploads')
const result = await uploadFile(file, 'invoice', onProgress);
// Result: uploads/invoice/1703123456789_invoice.pdf
```

### API Route Request
```typescript
const response = await fetch('/api/upload/presigned-url', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fileName: 'document.pdf',
    fileType: 'application/pdf',
    fileSize: 1024000,
    documentType: 'contract',
    folderPath: 'legal' // Optional
  })
});
```

## Recommended Folder Structure

```
s3-bucket/
├── kyc/                    # KYC documents
│   ├── pan/
│   ├── aadhar_front/
│   ├── aadhar_back/
│   ├── gst/
│   └── bank/
├── users/                  # User-related files
│   ├── profile/
│   ├── avatar/
│   └── documents/
├── products/               # Product images
│   ├── product/
│   ├── thumbnail/
│   └── gallery/
├── companies/              # Company files
│   ├── logo/
│   ├── documents/
│   └── certificates/
├── financial/              # Financial documents
│   ├── invoice/
│   ├── receipt/
│   └── statement/
└── uploads/                # Default folder
    └── ...
```

## Benefits

1. **Organization**: Files are logically grouped by purpose
2. **Access Control**: Can set different permissions per folder
3. **Backup**: Can backup specific folders independently
4. **Analytics**: Track usage by folder type
5. **Cleanup**: Easy to delete old files by category
6. **Cost Management**: Monitor storage costs by folder

## Migration Notes

- Existing files without `folderPath` will use the default `uploads/` folder
- The system is backward compatible
- You can gradually migrate to use folder paths
- No breaking changes to existing implementations
