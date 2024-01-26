import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['TEXT', 'VIDEO', "IMAGE"],
        default: 'TEXT',
        required: true
    },
    object: {
        type: String,
    },
    description: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'

        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'

        }
    ],
    shares: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'

        }
    ],
    visibility: {
        type: String,
        enum: ['PRIVATE', 'FRIENDS', 'PUBLIC'],
        default: 'PUBLIC'
    },
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'

        }
    ],
    location: {
        type: String
    }

}, { timestamps: true });

export const Post = mongoose.Model('Post', postSchema);
