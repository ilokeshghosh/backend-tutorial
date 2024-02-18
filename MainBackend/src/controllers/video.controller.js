import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    return res.status(200).json(new ApiResponse(200, { check: 'gogo' }, 'Everything is fine'));
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video


    if ([title, description].some(field => field?.trim() === '')) {
        throw new ApiError(400, 'All Fields are required');
    }

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail Not Found")
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUpload) {
        throw new ApiError(400, 'Failed To Upload Video')
    }
    if (!thumbnailUpload) {
        throw new ApiError(400, 'Failed To Upload Thumbnail')
    }


    const video = await Video.create({
        title,
        description,
        // videoFile: videoUpload.url ?? '',
        videoFile: {
            public_id: videoUpload.public_id ?? '',
            url: videoUpload.url ?? ''
        },
        // thumbnail: thumbnailUpload.url ?? '',
        thumbnail: {
            public_id: thumbnailUpload.public_id ?? '',
            url: thumbnailUpload.url ?? ''
        },
        owner: req.user?._id,
        duration: videoUpload.duration
    })

    if (!video) {
        throw new ApiError(400, "Failed to Publish Video");
    }

    return res.status(200).json(new ApiResponse(200, video, 'Video Published'));
})


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //TODO: get video by id
    if (!videoId) {
        throw new ApiError(401, 'Video ID Not Found');
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video Not Found")
    }

    return res.status(200).json(new ApiResponse(200, video, "Video Found"));

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body;
    // console.log('thumbnail',req.path)
    if ([title, description].some(value => value.trim() === '')) {
        throw new ApiError(404, 'All Value are required');
    }
    const currentVideo = await Video.findById(videoId);
    if (!currentVideo) {
        throw new ApiError(404, "Video Not Found");
    }
    // console.log('currentVideo',currentVideo)
    let thumbnailLocalPath;
    if (req.file && req.file.fieldname === 'thumbnail') {
        thumbnailLocalPath = req.file.path;
    }
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnailUpload) {
        throw new ApiError(500, "Failed to upload thumbnail");
    }

    const deleteThumbnail = await deleteFromCloudinary(currentVideo.thumbnail.public_id)
    if (!deleteThumbnail) {
        throw new ApiError(500, 'Failed To Delete Old Thumbnail')
    }
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title,
                description: description,
                thumbnail: {
                    public_id: thumbnailUpload.public_id ?? '',
                    url: thumbnailUpload.url ?? ''
                }
            },
        }, { new: true })

    if (!video) {
        throw new ApiError(500, 'Failed To Update')
    }

    return res.status(200).json(new ApiResponse(200, video, 'Video Details Updated'))

})


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!videoId) {
        throw new ApiError(401, "Video ID Not Found");
    }

    const response = await Video.findOneAndDelete(videoId, {
        projection: {
            videoFile: 1,
            thumbnail: 1
        }
    });
    if (!response) {
        throw new ApiError(401, "Video Not Deleted")
    }

    const deleteVideoCloudinary = await deleteFromCloudinary(response.videoFile?.public_id, 'video')
    const deleteThumbnailCloudinary = await deleteFromCloudinary(response.thumbnail?.public_id)

    if (!deleteVideoCloudinary || !deleteThumbnailCloudinary) {
        throw new ApiError(401, 'Failed To Delete Resources')
    }

    return res.status(200).json(new ApiResponse(200, 'Video Deleted Successfully'));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(404, 'Video ID Not Found')
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video Not Found")
    }

    video.isPublished = !video.isPublished;
    const response = await video.save();

    if (!response) {
        throw new ApiError(500, "Failed To Update Publish Status");
    }

    return res.status(200).json(new ApiResponse(200, response, 'Published Status Updated'));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}