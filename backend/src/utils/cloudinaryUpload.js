const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ni-it-club" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};

const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    if (!publicIds || publicIds.length === 0) return null;
    const validIds = publicIds.filter((id) => id);
    if (validIds.length === 0) return null;
    const result = await cloudinary.api.delete_resources(validIds);
    return result;
  } catch (error) {
    console.error("Cloudinary bulk delete error:", error);
    return null;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
};
