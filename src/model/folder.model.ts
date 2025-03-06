import { model, Schema } from 'mongoose';
import { IFolder } from '../types/types';

const folderSchema = new Schema(
  {
    name: { type: String, required: true },
    notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
  },
  { timestamps: true }
);

const Folder = model<IFolder>('Folder', folderSchema);

export default Folder;
