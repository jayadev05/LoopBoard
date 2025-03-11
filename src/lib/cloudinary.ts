import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadToCloudinary(file:File) {
    try {
      if (!file) throw new Error('No file provided');
  
      // Convert file to Base64
      const buffer = await file.arrayBuffer();
      const base64String = Buffer.from(buffer).toString('base64');
      const mimeType = file.type || 'image/jpeg'; // Default to JPEG if type is unknown
  
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(`data:${mimeType};base64,${base64String}`);
  
      return result.secure_url; // Return the uploaded file URL
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Upload failed');
    }
  }
