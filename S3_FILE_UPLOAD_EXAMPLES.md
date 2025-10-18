# S3FileUpload Component - Usage Examples

The `S3FileUpload` component is now **completely generic and reusable**! You can use it for any file upload scenario.

## 🎯 Key Changes Made:

1. **Generic Document Types**: No longer limited to KYC documents
2. **Customizable File Types**: Accept any file types via `accept` prop
3. **Custom File Size Limits**: Set custom size limits via `maxSize` prop
4. **Dynamic Labels**: Automatically generates readable labels from document type
5. **Flexible S3 Structure**: Files organized by document type in S3

## 📋 Usage Examples:

### 1. KYC Documents (Current Usage)
```tsx
// PAN Document
<S3FileUpload
  label="PAN Document"
  documentType="pan"
  required
  showPreview={true}
  previewHeight="h-32"
  onChange={handleFileChange('panDocument')}
/>

// Aadhar Front
<S3FileUpload
  label="Aadhar Front"
  documentType="aadhar_front"
  required
  showPreview={true}
  previewHeight="h-24"
  onChange={handleFileChange('aadharFront')}
/>
```

### 2. Profile Pictures
```tsx
<S3FileUpload
  label="Profile Picture"
  documentType="profile_picture"
  accept="image/*"
  maxSize={2 * 1024 * 1024} // 2MB
  showPreview={true}
  previewHeight="h-40"
  onChange={handleProfilePictureChange}
/>
```

### 3. Product Images
```tsx
<S3FileUpload
  label="Product Image"
  documentType="product_image"
  accept="image/*"
  maxSize={10 * 1024 * 1024} // 10MB
  showPreview={true}
  previewHeight="h-48"
  onChange={handleProductImageChange}
/>
```

### 4. Company Logo
```tsx
<S3FileUpload
  label="Company Logo"
  documentType="company_logo"
  accept="image/*"
  maxSize={1 * 1024 * 1024} // 1MB
  showPreview={true}
  previewHeight="h-32"
  onChange={handleLogoChange}
/>
```

### 5. Invoice Documents
```tsx
<S3FileUpload
  label="Invoice"
  documentType="invoice"
  accept=".pdf,.doc,.docx"
  maxSize={5 * 1024 * 1024} // 5MB
  showPreview={false}
  onChange={handleInvoiceChange}
/>
```

### 6. Video Uploads
```tsx
<S3FileUpload
  label="Video File"
  documentType="video"
  accept="video/*"
  maxSize={100 * 1024 * 1024} // 100MB
  showPreview={false}
  onChange={handleVideoChange}
/>
```

### 7. Any File Type
```tsx
<S3FileUpload
  label="Any Document"
  documentType="general_document"
  accept="*/*" // Accept all file types
  maxSize={50 * 1024 * 1024} // 50MB
  showPreview={false}
  onChange={handleDocumentChange}
/>
```

## 🔧 Component Props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Display label for the upload area |
| `documentType` | string | - | Type of document (used for S3 folder structure) |
| `accept` | string | `"image/*,.pdf"` | File types to accept |
| `maxSize` | number | `5MB` | Maximum file size in bytes |
| `showPreview` | boolean | `true` | Show image preview |
| `previewHeight` | string | `"h-32"` | Height of preview image |
| `required` | boolean | `false` | Mark as required field |
| `error` | string | - | Error message to display |
| `onChange` | function | - | Callback when file is uploaded |
| `onUploadStart` | function | - | Callback when upload starts |
| `onUploadComplete` | function | - | Callback when upload completes |
| `onUploadError` | function | - | Callback when upload fails |

## 📁 S3 File Organization:

Files are now organized in S3 like this:
```
your-bucket/
├── uploads/
│   ├── pan/
│   ├── aadhar_front/
│   ├── profile_picture/
│   ├── product_image/
│   ├── company_logo/
│   ├── invoice/
│   ├── video/
│   └── general_document/
```

## 🎨 Dynamic Labels:

The component automatically converts document types to readable labels:
- `pan` → "Pan"
- `aadhar_front` → "Aadhar Front"
- `profile_picture` → "Profile Picture"
- `company_logo` → "Company Logo"
- `product_image` → "Product Image"

## 🚀 Benefits:

✅ **Completely Reusable**: Use for any file upload scenario
✅ **Customizable**: Set custom file types and size limits
✅ **Flexible**: Works with any document type
✅ **Organized**: Files automatically organized in S3
✅ **User-Friendly**: Dynamic labels and validation
✅ **Secure**: Same security features as before

Now you can use this component anywhere in your application for any file upload needs! 🎉
