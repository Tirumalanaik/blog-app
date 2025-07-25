﻿const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Optional : Only show in development Remove later .......
if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Cloudinary configured successfully');
}

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'blog_images',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

module.exports = { cloudinary, storage };
