import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req?.user?._id

    // total subscribers count
    const totalSubscribers = await Subscription.find({
        channel: userId
    }).countDocuments()

    // total videos count
    const totalVideos = await Video.find({
        owner: userId
    }).countDocuments();

    // total likes count

    console.log('totalSubscriber', totalSubscribers)
    if (totalSubscribers < 0) {
        throw new ApiError(404, 'Failed To Total Subscriber')
    }

    if (totalVideos < 0) {
        throw new ApiError(404, 'Failed To Get Total Vidoes')
    }

    return res.status(200).json(new ApiResponse(200, {
        totalSubscribers,
        totalVideos
    }, 'Total Subscriber is '));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const videos = await Video.find({ owner: req?.user?._id })

    if (!videos) {
        throw new ApiError(404, 'Videos Not Found')
    }

    return res.status(200).json(new ApiResponse(200, videos, 'Videos Found'))
})

export {
    getChannelStats,
    getChannelVideos
}