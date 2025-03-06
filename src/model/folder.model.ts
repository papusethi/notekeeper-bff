import mongoose, { model, Schema } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  notes: mongoose.Types.ObjectId[];
}

const folderSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
  },
  { timestamps: true }
);

const Folder = model<IFolder>('Folder', folderSchema);

export default Folder;
