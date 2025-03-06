import { model, Schema } from 'mongoose';
import { INote } from '../types/types';

/**
 * Mongoose schema definition for the Note model.
 * Represents a note entity that contains user-generated content.
 */
const noteSchema = new Schema<INote>(
  {
    /**
     * The title of the note.
     * Defaults to null if not provided.
     */
    title: { type: String, default: null },

    /**
     * The main content of the note.
     * Defaults to null if not provided.
     */
    content: { type: String, default: null },

    /**
     * Indicates whether the note is pinned.
     * Defaults to false.
     */
    isPinned: { type: Boolean, default: false },

    /**
     * Indicates whether the note is starred (marked important).
     * Defaults to false.
     */
    isStarred: { type: Boolean, default: false },

    /**
     * Indicates whether the note is archived.
     * Defaults to false.
     */
    isArchived: { type: Boolean, default: false },

    /**
     * Indicates whether the note is deleted.
     * Defaults to false.
     */
    isDeleted: { type: Boolean, default: false },

    /**
     * The folder ID to which the note belongs.
     * Defaults to null if not assigned to any folder.
     */
    folderId: { type: Schema.Types.ObjectId, default: null }
  },
  {
    /**
     * Automatically adds `createdAt` and `updatedAt` timestamps to the document.
     */
    timestamps: true
  }
);

/**
 * Note model based on the defined schema.
 * This model allows performing CRUD operations on the `notes` collection.
 */
const Note = model<INote>('Note', noteSchema);

export default Note;
