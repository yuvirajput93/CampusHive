import asyncHandle from '../utils/asyncHandle.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiRes.js';
import Poll from '../models/polls.js';

const createPoll = asyncHandle(async (req, res) => {
    const { question, options } = req.body;

    if (!question || question.trim() === '') {
        throw new ApiError(400, 'Poll question cannot be empty');
    }
    if(!options || !Array.isArray(options) || options.length < 2) {
        throw new ApiError(400, 'Poll must have at least two options');
    }

    const formattedOptions = options.map(option => {
        if(!option || option.trim() === '') {
            throw new ApiError(400, 'Poll options cannot be empty');
        }
        return {text: option.trim(), votes:[]};
    });

    const poll= await Poll.create({
        question,
        options: formattedOptions,
        createdBy: req.user._id
    });

    if(!poll) {
        throw new ApiError(500, 'Failed to create poll');
    };

    return res
    .status(201)
    .json(new ApiResponse(
        201,
        poll,
        'Poll created successfully'
    ));
});

const getPolls = asyncHandle(async (req, res) => {
    const polls=await Poll.find({})
        .sort({ createdAt: -1 })
        .populate('createdBy', 'firstName lastName profilePic');

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            polls,
            'All polls retrieved successfully'
        ));
});

const deletePoll = asyncHandle(async (req, res) => {
    const {id}= req.params;
    const poll = await Poll.findById(id);
    if (!poll) {
        throw new ApiError(404, 'Poll not found');
    }

    if(poll.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'You do not have permission to delete this poll');
    }

    await Poll.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            'Poll deleted successfully'
        ));
});

const handleVote = asyncHandle(async (req, res) => {
    const { pollId,optionId}= req.params;
    const userId = req.user._id;

    const poll = await Poll.findById(pollId);
    if (!poll) {
        throw new ApiError(404, 'Poll not found');
    }

    const prevOption = poll.options.find(option => option.votes.includes(userId));
    if(prevOption){
        await Poll.updateOne(
            { _id: pollId, 'options._id': prevOption._id },
            { $pull: { 'options.$.votes': userId } }
        );
    }

    if(!prevOption || prevOption._id.toString()!== optionId){
        await Poll.updateOne(
            { _id: pollId, 'options._id': optionId },
            { $push : { 'options.$.votes': userId } }
        );
    }

    const updatedPoll = await Poll.findById(pollId)
        .populate('createdBy', 'firstName lastName profilePic');

    if (!updatedPoll){
        throw new ApiError(500, 'error updating poll');
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedPoll,
            'Vote updated successfully'
        ));
});

export {
    createPoll,
    getPolls,
    deletePoll,
    handleVote
};