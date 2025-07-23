// Utility functions for sending standardized success and error responses
import { Response } from 'express';

export function sendSuccess(res: Response, data: any = {}, message: string = 'Success', status: number = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function sendError(res: Response, error: any = {}, message: string = 'Error', status: number = 500) {
  return res.status(status).json({ success: false, message, error });
}

// Helper function to extract and verify JWT token
export function extractAndVerifyToken(authHeader?: string): { userId: string } | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    return decoded;
  } catch (err) {
    return null;
  }
} 