import User from '../models/user.js';
import ApiError from '../utils/apiError.js';



const generateAccessAndRefreshTokens = async (userId) =>{
    try{
        const user= await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave: false});

        return{
            accessToken,
            refreshToken
        }
    }catch(error) {
        throw new ApiError(500, "Error generating tokens");
    }
}

export default generateAccessAndRefreshTokens;