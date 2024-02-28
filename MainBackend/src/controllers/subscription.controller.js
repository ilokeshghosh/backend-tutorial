import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    if (!channelId) {
        throw new ApiError(404, "Channel Id Not Found")
    }

    if (!req.user) {
        throw new ApiError(401, "Unauthorized User");
    }

    const subscription = await Subscription.findOneAndDelete({
        channel: channelId,
        subscriber: req?.user?._id
    });

    if (!subscription) {
        const addSubscription = await Subscription.create({
            channel: channelId,
            subscriber: req?.user?._id
        })
        if (!addSubscription) {
            throw new ApiError(400, 'Failed to Add Subscription')
        }
    }

    return res.status(200).json(new ApiResponse(200, `${subscription ? 'Channel Unsubscribed' : 'Channel Subscribed'}`))



})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId) {
        throw new ApiError(404, "Channel Id not Found");
    }

    const subscriber = await Subscription.find({
        channel: channelId
    }, {
        project: {
            subscriber: 1
        }
    });

    if (!subscriber) {
        throw new ApiError(404, "Subscribers Not Found")
    }

    return res.status(200).json(new ApiResponse(200, subscriber, 'Subscribers Found'))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!subscriberId) {
        throw new ApiError(404, "User Id not Found");
    }

    const subscribed = await Subscription.find({
        subscriber: subscriberId
    }, {
        project: {
            channel: 1
        }
    })

    if (!subscribed) {
        throw new ApiError(404, 'Subscription List not Found')
    }

    return res.status(200).json(new ApiResponse(200, subscribed, 'Subscription List Found'));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}