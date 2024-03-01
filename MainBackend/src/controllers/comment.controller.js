import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    // Comment.aggregatePaginate()
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }
    // const findCommentByVideoId = await Comment.find({video:videoId});
    const findCommentByVideoId = await Comment.aggregatePaginate({ video: videoId }, options);
    if (!findCommentByVideoId) {
        throw new ApiError(404, 'Comment not Found')
    }

    if (findCommentByVideoId.docs.length === 0 && findCommentByVideoId.page > 1) {
        throw new ApiError(404, 'Page not Found')
    }

    return res.status(200).json(new ApiResponse(200, findCommentByVideoId, 'Comments Found'));
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;
    if (!videoId) {
        throw new ApiError(400, "Video Id not Found")
    }

    if (!content) {
        throw new ApiError(400, 'All Fields Are Required')
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req?.user?._id
    })

    if (!comment) {
        throw new ApiError(400, 'Failed To add Comment')
    }

    return res.status(200).json(new ApiResponse(200, comment, 'Comment Added'))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body
    if (!commentId) {
        throw new ApiError(404, 'Comment Id not Found')
    }

    if (!content) {
        throw new ApiError(400, 'All Field Are Required')
    }

    const comment = await Comment.findByIdAndUpdate({ _id: commentId }, { content }, { new: true });

    if (!comment) {
        throw new ApiError(404, 'Comment Not Found')
    }

    return res.status(200).json(new ApiResponse(200, comment, 'Comment Updated Successfully'));

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    if (!commentId) {
        throw new ApiError(404, 'Comment Id Not Found')
    }

    const comment = await Comment.findByIdAndDelete(commentId)

    if (!comment) {
        throw new ApiError(404, 'Comment Not Found');
    }

    return res.status(200).json(new ApiResponse(200, comment, 'Comment Deleted Successfully'))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
