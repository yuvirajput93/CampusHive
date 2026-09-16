import Comment from '../models/comment.js';
import Post from '../models/post.js';
import asyncHandle from '../utils/asyncHandle.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiRes.js';

const addComment= asyncHandle(async(req,res)=>{
    const {id}=req.params;
    const {text}=req.body;

    const post=await Post.findById(id);
    if(!post){
        throw new ApiError(404,'post not found');
    }

    const newComment= await Comment.create({
        text:text,
        createdBy: req.user._id,
        post: id
    });
    
    post.comments.push(newComment._id);
    await post.save();

    const addedComment= await Comment.findById(newComment._id).populate('createdBy','firstName lastName email profilePic');
    return res
    .status(201)
    .json(new ApiResponse(
        201,
        addedComment,
        'comment added successfully'
    ));
});

const getComment= asyncHandle(async(req,res)=>{
    const {id}=req.params;

    const comments= await Comment.find({post:id})
    .populate('createdBy','firstName lastName email profilePic')
    .sort({createdAt:-1});
    
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        comments,
        'comments retrieved successfully'
    ));
});

const deleteComment=asyncHandle(async(req,res)=>{
    const {id}=req.params;
    const comment=await Comment.findById(id);
    if(!comment){
        throw new ApiError(404,'comment not found');
    }
    if(comment.createdBy.toString()!==req.user._id.toString()){
        throw new ApiError(403,'you are not the owner of this comment');
    }

    await Post.findByIdAndUpdate(comment.post,{
        $pull:{comments: id}
    });

    await Comment.findByIdAndDelete(id);
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        'comment deleted successfully'
    ));
});

export {
    addComment,
    getComment,
    deleteComment
};