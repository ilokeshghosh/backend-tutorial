import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video
    if (!videoId) {
        throw new ApiError(400, 'Video Id not Found');
    }

    const videoLike = await Like.findOneAndDelete({ video: videoId });

    if (!videoLike) {
        const addVideoLike = await Like.create({
            video: videoId,
            likedBy: req?.user?._id
        })

        if (!addVideoLike) {
            throw new ApiError(400, 'Failed To Add Like Video')
        }
    }

    return res.status(200).json(new ApiResponse(200, `${videoLike ? 'Removed Like to Video' : 'Added Like to Video'}`))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    if (!commentId) {
        throw new ApiError(400, 'Comment Id not Found')
    }

    const commentLike = await Like.findOneAndDelete({ comment: commentId });
    if (!commentLike) {
        const addCommentLike = await Like.create({
            comment: commentId,
            likedBy: req?.user?._id
        })

        console.log('addCommentLike',addCommentLike)
        if (!addCommentLike) {
            throw new ApiError(400, "Failed To Like Comment")
        }
    }


    return res.status(200).json(new ApiResponse(200, `${commentLike ? 'Removed Like From Comment' : 'Added Like To Comment'}`))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    if (!tweetId) {
        throw new ApiError(400, 'Tweet Id not Found')
    }

    const tweetLike = await Like.findOneAndDelete({ tweet: tweetId });
    if (!tweetLike) {
        const addTweetLike = await Like.create({
            tweet: tweetId,
            likedBy: req?.user?._id
        })

        if (!addTweetLike) {
            throw new ApiError(400, 'Failed To Like Tweet')
        }
    }

    return res.status(200).json(new ApiResponse(200, `${tweetLike ? 'Removed Like From Tweet' : "Added Like to Tweet"}`));
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.find({
        $and: [{ likedBy: req?.user?._id }, { video: { $exists: true } }]
    })

    if (!likedVideos) {
        throw new ApiError('404', 'Liked Videos not Found')
    }

    return res.status(200).json(new ApiResponse(200, likedVideos, 'Found Liked Videos'))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}