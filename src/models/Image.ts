import mongoose, { Document, Schema, Types } from 'mongoose';


const ImageSchema = new Schema<IImage>(
  {
    storedUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IImage>('Image', ImageSchema); 