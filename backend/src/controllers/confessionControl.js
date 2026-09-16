import asyncHandle from '../utils/asyncHandle.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiRes.js';
import Confession from '../models/confession.js';

const createConfession = asyncHandle(async (req, res)=>{
    const {content}= req.body;
    if (!content || content.trim() === ''){
        throw new ApiError(400, 'Confession content cannot be empty');
    }

    const confession = await Confession.create({
        content,
    });

    if( !confession) {
        throw new ApiError(500, 'Failed to create confession');
    }

    return res
    .status(201)
    .json(new ApiResponse(
        201,
        confession,
        'Confession created successfully'
    ));
});

const getAllConfessions = asyncHandle(async (req, res) =>{
    const confessions = await Confession.find({})
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(
        200,
        confessions,
        'All confessions retrieved successfully'
    ));
});

const toggleLike = asyncHandle(async (req, res) =>{
    const { id } = req.params;
    const userId = req.user._id;

    const confession = await Confession.findById(id);
    if (!confession){
        throw new ApiError(404, 'Confession not found');
    }
    let updatedConfession;

    const hasLiked = confession.likes.includes(userId);
    if(hasLiked){
        updatedConfession = await Confession.findByIdAndUpdate(
            id,
            { $pull: { likes: userId } },
            { new: true }
        );
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                updatedConfession,
                'Confession unliked successfully'
            ));
    }else{
        updatedConfession = await Confession.findByIdAndUpdate(
            id,
            { $push: { likes: userId } },
            { new: true }
        );
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                updatedConfession,
                'Confession liked successfully'
            ));
    }

});

export{
    createConfession,
    getAllConfessions,
    toggleLike
};
