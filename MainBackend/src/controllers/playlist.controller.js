import mongoose, { isValidObjectId, pluralize } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    //TODO: create playlist
    if ([name, description].some((data) => data?.trim() === '')) {
        throw new ApiError(400, 'All Field are Required');
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req?.user._id
    })
    if (!playlist) {
        throw new ApiError(500, "Failed to Create Playlist")
    }

    return res.status(200).json(new ApiResponse(200, playlist, 'PlayList create Successfully'));

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    if (!userId) {
        throw new ApiError(400, 'All Field are Required');
    }

    // todo: add aggregation pipeline
    const userPlayLists = await Playlist.find({ owner: userId });
    if (!userPlayLists) {
        throw new ApiError(404, 'User Playlist not found')
    }

    return res.status(200).json(new ApiResponse(200, userPlayLists, 'User Playlists Found'));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id

    if (!playlistId) {
        throw new ApiError(400, 'Playlist Id is Required');
    }

    // todo: add aggregation pipeline
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, 'Playlist Not Found')
    }

    return res.status(200).json(new ApiResponse(200, playlist, 'Playlist Found'));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if ([playlistId, videoId].some((each) => each?.trim() === '')) {
        throw new ApiError(400, "All Fields Are Required")
    }

    const playlist = await Playlist.updateOne({ _id: playlistId }, {
        $push: {
            videos: videoId
        }
    })


    if (!playlist) {
        throw new ApiError(500, "Failed to Add Video In Playlist")
    }

    return res.status(200).json(new ApiResponse(200, playlist, 'Video Added In Playlist'));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    if ([playlistId, videoId].some(each => each.trim() === '')) {
        throw new ApiError(404, "All Fields Are Required");
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: new mongoose.Types.ObjectId(videoId) } },
        { new: true }
    )

    if (!playlist) {
        throw new ApiError(401, "Failed To Delete Video From PlayList");
    }


    return res.status(200).json(new ApiResponse(200, playlist, 'Video Removed From Playlist'));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    if (!playlistId) {
        throw new ApiError(400, "PlayList Id is required");
    }

    const playlist = await Playlist.findOneAndDelete({ _id: new mongoose.Types.ObjectId(playlistId) })
    if (!playlist) {
        throw new ApiError(404, "Failed to Delete Playlist")
    }

    return res.status(200).json(new ApiResponse(200, playlist, "PlayList Deleted Successfully"))


})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist

    if ([playlistId, name, description].some(each => each.trim() === '')) {
        throw new ApiError(400, "All Fields Are Required");
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        name, description
    }, { new: true })

    if (!playlist) {
        throw new ApiError(404, "Failed To Update Playlist");
    }

    return res.status(200).json(new ApiResponse(200, playlist, 'Playlist updated Successfully'));

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
