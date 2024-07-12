import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles',
    allowedFormats: ['jpg', 'png'],
  },
});

const upload = multer({ storage });

export default upload;
 