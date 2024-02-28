import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content, owner } = req.body;
    if (!content || !owner) {
        throw new ApiError(400, "All Fields Are Required")
    }

    const tweet = await Tweet.create({ content, owner });
    if (!tweet) {
        throw new ApiError(400, "Failed To Create Tweet")
    }

    return res.status(200).json(new ApiResponse(200, tweet, 'Tweet Created'))

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params

    if (!userId) {
        throw new ApiError(400, 'User Id not Found')
    }

    const tweets = await Tweet.find({ owner: userId });

    if (!tweets) {
        throw new ApiError(404, "User Tweet Not Found")
    }


    return res.status(200).json(new ApiResponse(200, tweets, 'User Tweets Found'));

})

const getTweetById = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!tweetId) {
        throw new ApiError(400, 'Tweet Id not Found')
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, 'Tweet Not Found')
    }

    return res.status(200).json(new ApiResponse(200, tweet, 'Tweet Found'));
})


const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId) {
        throw new ApiError(404, 'Tweet ID not Found');
    }

    if (!content) {
        throw new ApiError(400, 'All Fields are Required');
    }

    const tweet = await Tweet.findByIdAndUpdate({ _id: tweetId }, { content }, { new: true });

    if (!tweet) {
        throw new ApiError(400, 'Tweet not Found');
    }

    return res.status(200).json(new ApiResponse(200, tweet, "Tweet Updated"));



})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    if (!tweetId) {
        throw new ApiError(404, "Tweet Id Not Found")
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if (!tweet) {
        throw new ApiError(404, 'Tweet Not Found')
    }

    return res.status(200).json(new ApiResponse(200, tweet, "Tweet Deleted Successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getTweetById
}
