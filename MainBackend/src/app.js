import express from 'express'
import cors from 'cors'
import cookieParse from 'cookie-parser'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'));
app.use(cookieParse());


// routes import
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js'
import playlistRouter from './routes/playlist.routes.js';
app.use('/api/v1/users', userRouter);
app.use('/api/v1/video', videoRouter)
app.use('/api/v1/playlist',playlistRouter)

// http://localhost:8000/api/v1/users/...

export { app }