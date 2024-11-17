import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config({
    path : './.env'
})


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (filepath) => {
    try {
        if (!filepath) return null
        
        const res = await cloudinary.uploader.upload(filepath , {
            resource_type : 'auto'
        }) //file uploaded

        console.log('uploaded successfully' , res.url);
        fs.unlinkSync(filepath);

        return res.url
    } catch (error) {
        console.log(filepath);
        fs.unlinkSync(filepath)
        console.log(error);
        return null
    }
}
const deleteFromCloudinary = async (url) => {
    try {
        if (!url) return null;

        
        const regex = /upload\/(.*?)\./;
        const match = url.match(regex);
        
        if (!match || match.length < 2) {
            console.log('Invalid Cloudinary URL');
            return null;
        }

        const publicId = match[1]; 
        const res = await cloudinary.uploader.destroy(publicId); 
        console.log('Deleted successfully', res);

        return res.result === 'ok' ? true : false;
    } catch (error) {
        console.log('Error deleting file from Cloudinary:', error);
        return false;
    }
}

export {uploadOnCloudinary , deleteFromCloudinary}