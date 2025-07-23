import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';


const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    password: { type: String, required: true },
    phoneNo: { type: String},
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema); 