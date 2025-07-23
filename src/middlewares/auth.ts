import {  Response, NextFunction } from 'express';
import logger from '../config/winston';
import { extractAndVerifyToken } from '../utils/common';

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  let authHeader = req.headers.authorization;
  if(req.route.path==='/user/:userId'){
    if(authHeader){
      const decoded = extractAndVerifyToken(authHeader);
      if (decoded) {
        req.userId = decoded.userId;
        logger.info('Auth: Token verified', { userId: decoded.userId });
        next();
      } else {
        logger.warn('Auth: Invalid token', { headers: req.headers });
        return res.status(401).json({ message: 'Invalid token' });
      }
    }else{
      next();
    }
  }
  else{
    const decoded = extractAndVerifyToken(authHeader);
    if (!decoded) {
      logger.warn('Auth: No or invalid token provided', { headers: req.headers });
      return res.status(401).json({ message: 'No or invalid token provided' });
    }
    req.userId = decoded.userId;
    logger.info('Auth: Token verified', { userId: decoded.userId });
    next();
  }
}; 