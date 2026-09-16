import asyncHandle from '../utils/asyncHandle.js';
import apiError from '../utils/apiError.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const verifyJWT=asyncHandle(async(req,res,next)=>{
    try{
        const token=req.cookies?.accessToken||req.headers?.authorization?.replace("Bearer ", "");

        if(!token){
            throw new apiError(401,"Token Not Found");
        }
        const decoded=jwt.verify(token,process.env.ACCESS_JWT_SECRET);
        const user= await User.findById(decoded?._id).select("-password -refreshToken");

        if(!user){
            throw new apiError(401,"user not found");
        }

        req.user=user;
        next();
    }catch(error){
        console.error(error);
        throw new apiError(401,"Unauthorized");
    }
});

export default verifyJWT;