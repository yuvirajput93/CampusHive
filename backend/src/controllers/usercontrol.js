import asyncHandle from '../utils/asyncHandle.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiRes.js';
import User from '../models/user.js';
import {uploadOnCloudinary,Cloudinary} from '../utils/cloudinary.js';
import generateAccessAndRefreshTokens from '../utils/token.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendVerificationEmail from '../utils/sendEmail.js';

const signUp = asyncHandle(async (req, res) => {
    const { admNo, email, password, discipline, branch, firstName, lastName } = req.body;
    if (!admNo || !email || !password || !discipline || !branch || !firstName) {
        throw new ApiError(400, 'all fields are required');
    }

    if(!email.endsWith('@iitism.ac.in')){
        throw new ApiError(400, 'IIT ISM email required');
    }


    const verificationToken= crypto.randomBytes(32).toString('hex');


    const userExist = await User.findOne({ email });
    if (userExist) {
        throw new ApiError(400, 'user already exist');
    }

    let profilePicUrl = '';
    if (req.file?.path) {
        const uploadResult = await uploadOnCloudinary(req.file.path, 'profilePics');
        if (!uploadResult) {
            throw new ApiError(500, 'Failed to upload profile picture');
        }
        profilePicUrl = uploadResult.secure_url;
    }

    const newUser = await User.create({
        admNo,
        email,
        password,
        discipline,
        branch,
        firstName,
        lastName,
        profilePic: profilePicUrl,
        verificationToken
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, 'User creation failed');
    }

    await sendVerificationEmail(newUser.email, newUser.verificationToken);

    return res.status(201).json(
        new ApiResponse(201, {}, "Registration successful! Please check your email to verify your account.")
    );
});

const login = asyncHandle(async (req, res) => {
    const { emailOrAdmNo, password } = req.body;
    if (!emailOrAdmNo || !password) {
        throw new ApiError(400, 'all fields are required');
    }
    const user = await User.findOne({
        $or: [
            { email: { $regex: new RegExp(`^${emailOrAdmNo}$`, 'i') } },
            { admNo: { $regex: new RegExp(`^${emailOrAdmNo}$`, 'i') } }
        ]
    });

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    if(!user.isVerified){
        throw new ApiError(403, 'Please verify your email address before logging in.');
    }

    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    
    // The options for setting cookies for cross-domain communication
    const options = {
        httpOnly: true,
        secure: true, 
        sameSite: 'none' // Allows the cookie to be sent from Vercel to Render
    };
    

    // Note: The flagCookie is no longer needed with the apiClient setup, but we'll update it too.
    const flagCookieOptions = {
        secure: true,
        sameSite: 'none'
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .cookie("isLoggedIn", "true", flagCookieOptions) 
        .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const currentUser = asyncHandle(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "Current user retrieved successfully"
        ));
});

const logout = asyncHandle(async (req, res) => {
    // --- START OF FIX ---
    // The options must be identical to how they were set to clear them correctly
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    };
    
    const flagCookieOptions = {
        secure: true,
        sameSite: 'none'
    };
    // --- END OF FIX ---

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .clearCookie("isLoggedIn", flagCookieOptions) // Clear the flag cookie too
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const userProfile=asyncHandle(async(req,res)=>{
    const {id}=req.params;
    const user=await User.findById(id).select('-password -refreshToken');

    if(!user){
        throw new ApiError (404,"User not found");
        
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "User profile retrieved successfully"
    ));
});

const refreshAccessToken = asyncHandle(async (req, res) => {
    const incomingRefresh=req.cookies.refreshToken||req.body.refreshToken;

    if(!incomingRefresh){
        throw new ApiError(401,"No refresh token provided");
    }

    const decodedToken =jwt.verify(
        incomingRefresh, 
        process.env.REFRESH_JWT_SECRET
    );
    const user = await User.findById(decodedToken._id);
    
    if(!user){
        throw new ApiError(401, "invalid refresh token");
    }

    if(incomingRefresh !== user?.refreshToken) {
        throw new ApiError(401, "invalid refresh token");
    }

    const options={
        httpOnly:true,
        secure: true,
        sameSite: 'none'
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {accessToken, refreshToken},
            "Access token refreshed successfully"
        )   
    );
});

const verifyEmail=asyncHandle(async(req,res)=>{
    const {token}=req.params;

    const user = await User.findOne({verificationToken:token});

    if (!user) {
        throw new ApiError(404, "Invalid or expired verification token.");
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token so it can't be used again
    await user.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true, 
        sameSite: 'none'
    };
    
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "Email verified successfully! You are now logged in."));
});

const searchUser=asyncHandle(async(req,res)=>{
    const {q}=req.query;
    if(!q){
        throw new ApiError(400,"Query string is required");
    }


    const users=await User.find({
        $or:[
            {firstName:{$regex: q, $options: 'i'}},
            {lastName:{$regex: q, $options: 'i'}},
            {admNo:{$regex: q, $options: 'i'}},
        ]
    }).select('-password -refreshToken');

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        users,
        "User search completed successfully"
    ));
});

const followUser = asyncHandle(async (req, res) => {
    const { id: userToFollowId } = req.params;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === userToFollowId) {
        throw new ApiError(400, "You cannot follow yourself");
    }

    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
        throw new ApiError(404, "User to follow not found");
    }

    await Promise.all([
        User.findByIdAndUpdate(
            currentUserId,
            { $addToSet: { following: userToFollowId } }
        ),
        User.findByIdAndUpdate(
            userToFollowId,
            { $addToSet: { followers: currentUserId } }
        )
    ]);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            `You are now following ${userToFollow.firstName}${userToFollow.lastName ? ` ${userToFollow.lastName}` : ''}`
        ));
});

const unfollowUser = asyncHandle(async (req, res) => {
    const { id: userToUnfollowId } = req.params;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === userToUnfollowId) {
        throw new ApiError(400, "You cannot unfollow yourself");
    }

    const userToUnfollow = await User.findById(userToUnfollowId);
    if (!userToUnfollow) {
        throw new ApiError(404, "User to unfollow not found");
    }

    await Promise.all([
        User.findByIdAndUpdate(
            currentUserId,
            { $pull: { following: userToUnfollowId } }
        ),
        User.findByIdAndUpdate(
            userToUnfollowId,
            { $pull: { followers: currentUserId } }
        )
    ]);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            `You have unfollowed ${userToUnfollow.firstName}${userToUnfollow.lastName ? ` ${userToUnfollow.lastName}` : ''}`
        ));
});

export {
    signUp,
    login,
    currentUser,
    logout,
    userProfile,
    refreshAccessToken,
    verifyEmail,
    searchUser,
    followUser,
    unfollowUser
};
