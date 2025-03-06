import { Document, Types } from 'mongoose';

export type THttpResponse = {
  success: boolean;
  statusCode: number;
  request: {
    ip?: string | null;
    method: string;
    url: string;
  };
  message: string;
  data: unknown;
};

export type THttpError = {
  success: boolean;
  statusCode: number;
  request: {
    ip?: string | null;
    method: string;
    url: string;
  };
  message: string;
  data: unknown;
  trace?: object | null;
};

/**
 * Note Interface - Represents a single note inside a folder.
 */
export interface INote extends Document {
  _id: Types.ObjectId;
  title: string | null;
  content: string | null;
  isPinned: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
}

/**
 * Folder Interface - Represents a folder containing multiple notes.
 */
export interface IFolder extends Document {
  _id: Types.ObjectId;
  name: string;
  notes: Types.ObjectId[];
}

/**
 * User Interface - Represents a user with folders.
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  folders: Types.ObjectId[];
}
