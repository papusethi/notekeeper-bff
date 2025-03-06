import { model, Schema } from 'mongoose';
import { IUser } from '../types/types';

/**
 * Mongoose schema definition for the User model.
 * Represents a user entity with authentication details and associations to notes and folders.
 */
const userSchema = new Schema<IUser>(
  {
    /**
     * Unique username for the user.
     * This field is required and must be unique.
     */
    username: { type: String, required: true, unique: true },

    /**
     * Email address of the user.
     * This field is required and must be unique.
     */
    email: { type: String, required: true, unique: true },

    /**
     * Hashed password for authentication.
     * This field is required.
     */
    password: { type: String, required: true },

    /**
     * List of notes associated with the user.
     * References the `Note` model.
     */
    notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],

    /**
     * List of folders associated with the user.
     * References the `Folder` model.
     */
    folders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }]
  },
  {
    /**
     * Automatically adds `createdAt` and `updatedAt` timestamps to the document.
     */
    timestamps: true
  }
);

/**
 * User model based on the defined schema.
 * This model allows performing CRUD operations on the `users` collection.
 */
const User = model<IUser>('User', userSchema);

export default User;
