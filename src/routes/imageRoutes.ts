import { Router } from 'express';
import { uploadImage, getUserImages, deleteImage } from '../controllers/imageController';
import { auth } from '../middlewares/auth';
import { upload } from '../middlewares/upload';


const router = Router();

router.post('/upload', auth, upload.single('image'), uploadImage);
router.get('/user/:userId',auth, getUserImages); 
router.delete('/:imageId', auth, deleteImage);

export default router; 