import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['PERSONAL', 'GROUP'],
        default: 'PERSONAL'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String
    }
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);