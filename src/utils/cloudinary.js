//this code can be taken from cloudinary documentation all we did was we used async handler utility and wraped it in a try catch and added a delete file method which deletes files from local storage once it is uploaded

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError";

cloudinary.config({
  //sensitive information of cloudinary cloud which it kept in .env file
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export const deleteFromCloudinary = async (resourceId) => {
  console.log("deleting the file");
  console.log(resourceId);

  try {
    if (!resourceId) return null;

    const response = await cloudinary.uploader.destroy(resourceId);
    return response;
  } catch (error) {
    throw new ApiError(500, "Couldn't delete file from cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };

//this is cloudinary code on which we upload our files like images because it is not recommended to store such data on normal database like mongoDB
