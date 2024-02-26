import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js'
import { publishAVideo, getAllVideos, getVideoById, updateVideo, deleteVideo, togglePublishStatus } from '../controllers/video.controller.js';

const router = Router();
router.use(verifyJWT);

router.route('/').get(getAllVideos).post(upload.fields([
    {
        name: 'videoFile',
        maxCount: 1
    },
    {
        name: 'thumbnail',
        maxCount: 1
    }
]),
    publishAVideo
);

router.route('/:videoId')
    .get(getVideoById)
    .patch(upload.single('thumbnail'), updateVideo)
    .delete(deleteVideo)

router.route('/toggle/publish/:videoId').patch(togglePublishStatus)

export default router