import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

/**
 * Multer configuration for handling file uploads
 * Uses memory storage for direct Cloudinary upload
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"), false);
    }
  }
});

// Helper function to upload file to Cloudinary
export const uploadToCloudinary = async (file, folder = "ecommerce-products") => {
  try {
    console.log(`🔄 Starting Cloudinary upload to folder: ${folder}`);
    console.log(`📄 File details:`, {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
          use_filename: true,
          unique_filename: true,
          overwrite: false
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("✅ Cloudinary upload success!");
            console.log("🔗 Secure URL:", result.secure_url);
            console.log("🆔 Public ID:", result.public_id);
            resolve(result.secure_url);
          }
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const bufferStream = Readable.from(file.buffer);
      bufferStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("❌ Upload function error:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Helper function to delete file from Cloudinary
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/filename.jpg
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    
    if (uploadIndex === -1) return false;
    
    // Get everything after 'upload/v123456/'
    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join("/");
    // Remove file extension
    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."));
    
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
};

export default upload;
