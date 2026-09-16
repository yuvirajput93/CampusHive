import {v2 as Cloudinary} from 'cloudinary';
import fs from 'fs';

Cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary=async(localFilePath,folder='profilePics')=>{
    if(!localFilePath)return null;
    try{
        const result=await Cloudinary.uploader.upload(localFilePath,{folder});
        fs.unlinkSync(localFilePath);
        return result;
    }catch(error){
        fs.unlinkSync(localFilePath);
        console.error('Error uploading file to Cloudinary:', error);
        return null;
    }
}

export {uploadOnCloudinary,Cloudinary};