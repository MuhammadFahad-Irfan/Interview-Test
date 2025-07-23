import {  Response } from 'express';
import Image from '../models/Image';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import logger from '../config/winston';
import { sendSuccess, sendError } from '../utils/common';



export const uploadImage = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    if (!req.file) {
      logger.warn('UploadImage: No file uploaded', { userId: req.userId });
      return sendError(res, {}, 'No file uploaded', 400);
    }
    const { isPublic } = req.body;
    const {originalname,buffer} = req.file;
    const result:any = await uploadToCloudinary(buffer,originalname);
    const image = await Image.create({
      storedUrl: result.url,
      publicId: result.public_id,
      isPublic: isPublic === 'true',
      userId: req.userId,
    });
    logger.info('Image uploaded', { imageId: image._id, userId: req.userId });
    return sendSuccess(res, image, 'Image uploaded', 201);
  } catch (err) {
    logger.error('UploadImage: Upload failed', { error: err, userId: req.userId });
    return sendError(res, err, 'Upload failed', 500);
  }
};

export const getUserImages = async (req: CustomRequest, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    
    let query: Record<string, any> = { userId };
    if(req.userId!==userId){
      logger.info('getUserImages: Non-owner requesting public images', { requesterId: req.userId, userId });
      query.isPublic=true;
    }
    
    const skip: number = (page - 1) * limit;
    const total: number = await Image.countDocuments(query);
    const images = await Image.find(query)
      .sort({createdAt:-1 })
      .skip(skip)
      .limit(limit);

    logger.info('getUserImages: Images fetched', { userId, total, page, limit, returned: images.length });

    const result: ImagePaginationResult<typeof images[0]> = {
      images,
      pagination: {
        total,
        page,
        limit,
      },
    };

    return sendSuccess(res, result, 'Images fetched');
  } catch (err) {
    logger.error('getUserImages: Error fetching images', { error: err, userId: req.params.userId });
    return sendError(res, err, 'Error fetching images', 500);
  }
};

export const deleteImage = (req: CustomRequest, res: Response): Promise<Response> => {
  return Image.findById(req.params.imageId)
    .then(image => {
      if (!image) {
        logger.warn('DeleteImage: Image not found', { imageId: req.params.imageId, userId: req.userId });
        return sendError(res, {}, 'Image not found', 404);
      }
      console.log(image)
      if (image.userId.toString() !== req.userId) {
        logger.warn('DeleteImage: Not authorized', { imageId: req.params.imageId, userId: req.userId });
        return sendError(res, {}, 'Not authorized', 403);
      }
      return deleteFromCloudinary(image.publicId)
        .then(() => image.deleteOne())
        .then(() => {
          logger.info('DeleteImage: Image deleted', { imageId: req.params.imageId, userId: req.userId });
          return sendSuccess(res, {}, 'Image deleted');
        });
    })
    .catch(err => {
      logger.error('DeleteImage: Delete failed', { error: err, imageId: req.params.imageId, userId: req.userId });
      return sendError(res, err, 'Delete failed', 500);
    });
}; 