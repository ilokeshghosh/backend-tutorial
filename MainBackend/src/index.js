// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js'
import { app } from './app.js';

dotenv.config({
    path: './env'
})


connectDB()
    .then(() => {
        app.on('error', (error) => {
            console.log(`ERROR IN APP :: ${error}`)
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at : ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log('MONGODB CONNECTION FAILED !!', error);
    })
















/*

import express from 'express'
const app = express();
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on('error', (error) => {
            console.log('ERROR : ', error);
            throw error;
        })
        app.listen(process.env.PORT, () => {
            console.log(`App is running on :  http://localhost:${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR is :: ", error)
    }
})()

*/