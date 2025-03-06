import { model, Schema } from 'mongoose';
import { IUser } from '../types/types';

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    folders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }]
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;
