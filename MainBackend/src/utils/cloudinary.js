import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { ApiError } from './ApiError.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        //file has been uploaded successfully
        // console.log('File is uploaded on cloudinary', response.url);

        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
    // finally{
    //     fs.unlinkSync(localFilePath)
    // }
}

const deleteFromCloudinary = async (public_id, resourceType = 'image') => {
    try {
        if (!public_id) {
            throw new ApiError(404, 'Asset Id Not Found')
        }
        const response = await cloudinary.uploader.destroy(public_id, { resource_type: resourceType })
        if (!response) {
            throw new ApiError(500, 'Failed To Delete Assets')
        }

        return response;
    } catch (error) {
        throw new ApiError(400, error.message)
    }
}


export { uploadOnCloudinary, deleteFromCloudinary }