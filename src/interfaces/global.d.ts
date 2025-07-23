import { Request } from 'express';

declare global {
export interface ImagePaginationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ImagePaginationResult<T> {
  images: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface UserRegisterBody {
  name: string;
  password: string;
  phoneNo: string;
}

export interface UserLoginBody {
  phoneNo: string;
  password: string;
}

export interface UserProfileResponse {
  _id: string;
  name: string;
  phoneNo: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserParams {
  userId: string;
}

export interface CustomRequest<T = any, U = any, P = any> extends Request {
  userId?: string;
  body: T;
  params: P;
  query: U;
}

export interface IUser extends Document {
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  password: string;
  phoneNo?: string;
  email:string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IImage extends Document {
  storedUrl: string;
  publicId: string;
  isPublic: boolean;
  userId: Types.ObjectId;
}
}
declare module 'swagger-ui-express';
