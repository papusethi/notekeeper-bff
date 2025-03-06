import { model, Schema } from 'mongoose';
import { IFolder } from '../types/types';

/**
 * Mongoose schema definition for the Folder model.
 * Represents a folder entity that contains user-organized notes or files.
 */
const folderSchema = new Schema<IFolder>(
  {
    /**
     * The name of the folder.
     * This field is required and must be a string.
     */
    name: { type: String, required: true }
  },
  {
    /**
     * Automatically adds `createdAt` and `updatedAt` timestamps to the document.
     */
    timestamps: true
  }
);

/**
 * Folder model based on the defined schema.
 * This model allows performing CRUD operations on the `folders` collection.
 */
const Folder = model<IFolder>('Folder', folderSchema);

export default Folder;
