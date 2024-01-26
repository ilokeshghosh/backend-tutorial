import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    }
})

const orderAddress = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    zipCode: {
        type: Number,
        required: true
    }
})


const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    orderItems: [orderItemSchema],

    address: {
        type: orderAddress,
        required: true
    },

    status: {
        type: String,
        enum: ['PENDING', "CANCELLED", "DELIVERED"],
        default: "PENDING"
    }

}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);