// server-mysql/config/clodinary.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadOnCloudinary = async (files, action) => {
    if (action !== 'create' && action !== 'update') {
        throw new Error("Not a valid action");
    }
    try {
        if (!files || files.length === 0) {
            throw new Error("No files provided");
        }

        const uploadPromises = files.map(async (file) => {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "");

            const folderPath = `books/`;

            try {
                const response = await cloudinary.uploader.upload(file.path, {
                    resource_type: "image",
                    use_filename: true,
                    unique_filename: false,
                    folder: folderPath,
                    public_id: `${timestamp}_${file.originalname}`
                });

                fs.unlinkSync(file.path);

                return {
                    url: response.url,
                    public_id: response.public_id,
                    original_filename: file.originalname,
                    resource_type: response.resource_type
                };
            } catch (uploadError) {
                console.error(`Upload failed for file ${file.originalname}:`, uploadError);
                return null;
            }
        });

        const uploadResults = await Promise.all(uploadPromises);

        return uploadResults.filter(result => result !== null);
    } catch (error) {
        console.error("Multiple file upload to Cloudinary failed:", error);
        throw error;
    }
};
module.exports = { uploadOnCloudinary };