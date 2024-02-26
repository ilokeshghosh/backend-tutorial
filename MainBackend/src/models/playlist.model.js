import mongoose, { Schema, model } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    videos: [
        { type: Schema.Types.ObjectId, ref: 'Video', unique: true }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

export const Playlist = model('Playlist', playlistSchema)