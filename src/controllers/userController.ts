import {  Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import logger from '../config/winston';
import { sendSuccess, sendError } from '../utils/common';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: CustomRequest, res: Response) => {
  try {
    const { name, password, email} = req.body;
    if (!name || !password || !email) {
      logger.warn('Register: Missing fields', { body: req.body });
      return sendError(res, {}, 'All fields are required', 400);
    }
    const existing = await User.findOne({ email });
    if (existing) {
      logger.warn('Register: Email already registered', { email });
      return sendError(res, {}, 'Email already registered', 409);
    }
    const user = await User.create({ name, password, email });
    logger.info('User registered successfully', { userId: user._id });
    return sendSuccess(res,{_id:user}, 'User registered successfully', 201);
  } catch (err) {
    logger.error('Register: Server error', { error: err });
    return sendError(res, err, 'Server error', 500);
  }
};

export const login = async (req: CustomRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      logger.warn('Login: Invalid credentials', { email });
      return sendError(res, {}, 'Invalid credentials', 401);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Login: Invalid credentials', { email });
      return sendError(res, {}, 'Invalid credentials', 401);
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    logger.info('User logged in', { userId: user._id });
    return sendSuccess(res, { token }, 'Login successful');
  } catch (err) {
    logger.error('Login: Server error', { error: err });
    return sendError(res, err, 'Server error', 500);
  }
};

export const getProfile = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      logger.warn('GetProfile: User not found', { userId: req.userId });
      return sendError(res, {}, 'User not found', 404);
    }
    logger.info('Fetched user profile', { userId: req.userId });
     
    return sendSuccess(res, user, 'Profile fetched');
  } catch (err) {
    logger.error('GetProfile: Server error', { error: err });
    return sendError(res, err, 'Server error', 500);
  }
};

export const updateProfile = async (req: CustomRequest, res: Response) => {
  try {
   
    const user = await User.findByIdAndUpdate(
      req.userId,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      logger.warn('UpdateProfile: User not found', { userId: req.userId });
      return sendError(res, {}, 'User not found', 404);
    }
    logger.info('Updated user profile', { userId: req.userId });
    return sendSuccess(res, user, 'Profile updated');
  } catch (err) {
    logger.error('UpdateProfile: Server error', { error: err });
    return sendError(res, err, 'Server error', 500);
  }
};

export const getUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user || user.isDeleted) {
      logger.warn('GetUserProfile: User not found', { userId: req.params.userId });
      return sendError(res, {}, 'User not found', 404);
    }
    logger.info('Fetched user profile by id', { userId: req.params.userId });
    return sendSuccess(res, user, 'Profile fetched');
  } catch (err) {
    logger.error('GetUserProfile: Server error', { error: err });
    return sendError(res, err, 'Server error', 500);
  }
}; 