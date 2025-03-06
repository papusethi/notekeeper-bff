import { model, Schema } from 'mongoose';
import { INote } from '../types/types';

const noteSchema = new Schema(
  {
    title: { type: String, default: null },
    content: { type: String, default: null },
    isPinned: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Note = model<INote>('Note', noteSchema);

export default Note;
