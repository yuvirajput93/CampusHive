import asyncHandle from '../utils/asyncHandle.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiRes.js';
import Post from '../models/post.js';
import { uploadOnCloudinary, Cloudinary } from '../utils/cloudinary.js';

const createPost = asyncHandle(async (req, res) => {
    const { content } = req.body;

    if (!content && !req.file) {
        throw new ApiError(400, 'Post must have either content or an image');
    }

    let imageUrl = null;
    let imageId = '';
    if (req.file) {
        const result = await uploadOnCloudinary(req.file.path);
        if (!result || !result.secure_url) {
            throw new ApiError(500, 'Failed to upload image');
        }
        imageUrl = result.secure_url;
        imageId = result.public_id;
    }

    const post = await Post.create({
        content,
        image: imageUrl,
        author: req.user._id,
        imagePublicId: imageId
    });

    const createdPost = await Post.findById(post._id).populate(
        'author',
        'firstName lastName profilePic'
    );

    if (!createdPost) {
        throw new ApiError(500, "Failed to create and retrieve post");
    }

    return res
        .status(201)
        .json(new ApiResponse(
            201,
            createdPost,
            'Post created successfully'
        ));
});

const getAllPost = asyncHandle(async (req, res) => {
    const posts = await Post.find({})
        .populate('author', 'firstName lastName admNo email profilePic')
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            posts,
            'All posts retrieved successfully'
        ));
});

const deletePost = asyncHandle(async (req, res) => {
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to delete this post');
    }

    if (post.imagePublicId) {
        try {
            await Cloudinary.uploader.destroy(post.imagePublicId);
        } catch (e) {
            console.error("unable to delete form cloudinary", e);
        }
    }

    await Post.findByIdAndDelete(postId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Post deleted successfully'));
});


const updatePost = asyncHandle(async (req, res) => {
    const { id: postId } = req.params;
    const { content, image } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }
    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You are not authorized to update this post');
    }

    let updatedData = { content };
    
    if (req.file){
        if (post.imagePublicId) {
            try {
                await Cloudinary.uploader.destroy(post.imagePublicId);
            } catch (e) {
                console.error("Failed to delete old image from Cloudinary", e);
            }
        }

        const result = await uploadOnCloudinary(req.file.path);
        if (!result || !result.secure_url) {
            throw new ApiError(500, 'Failed to upload new image');
        }
        updatedData.image = result.secure_url;
        updatedData.imagePublicId = result.public_id;
    } 
    else if (image === '' && post.imagePublicId) {
        try {
            await Cloudinary.uploader.destroy(post.imagePublicId);
        } catch (e) {
            console.error("Failed to delete image from Cloudinary", e);
        }
        updatedData.image = null;
        updatedData.imagePublicId = null;
    }

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: updatedData },
        { new: true }
    ).populate('author', 'firstName lastName profilePic');

    if (!updatedPost) {
        throw new ApiError(500, 'Failed to update post');
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedPost,
            'Post updated successfully',
        ));
});

const likeUnlikePost = asyncHandle(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    const isLiked = post.likes.includes(userId);
    let updatedPost;

    if (isLiked) {
        updatedPost = await Post.findByIdAndUpdate(
            id,
            { $pull: { likes: userId } },
            { new: true }
        );
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                updatedPost,
                'Post unliked successfully',
            ));
    } else {
        updatedPost = await Post.findByIdAndUpdate(
            id,
            { $push: { likes: userId } },
            { new: true }
        );
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                updatedPost,
                'Post liked successfully',
            ));
    }
});

export {
    createPost,
    getAllPost,
    deletePost,
    updatePost,
    likeUnlikePost
};