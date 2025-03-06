import { NextFunction, Request, Response } from 'express';
import Folder from '../model/folder.model';
import User from '../model/user.model';
import httpError from '../utils/httpError';
import httpResponse from '../utils/httpResponse';

/**
 * Fetches the folders associated with the authenticated user.
 */
const getFolders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string })?.id;

    if (!userId) {
      return httpResponse(req, res, 400, 'User ID is missing');
    }

    const user = await User.findById(userId).populate('folders');

    if (!user) {
      return httpResponse(req, res, 404, 'User not found');
    }

    httpResponse(req, res, 200, 'Folders fetched successfully', user.folders);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

/**
 * Creates a new folder and associates it with the user.
 */
const createFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string })?.id;
    const { name } = req.body as { name: string };

    if (!userId) {
      return httpResponse(req, res, 400, 'User ID is required');
    }

    if (!name) {
      return httpResponse(req, res, 400, 'Folder name is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      return httpResponse(req, res, 404, 'User not found');
    }

    const folder = new Folder({ name });
    await folder.save();

    user.folders.push(folder._id);
    await user.save();

    const updatedUser = await User.findById(userId).populate('folders');

    httpResponse(req, res, 201, 'Folder created successfully', updatedUser?.folders);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

/**
 * Updates a folder by its ID.
 */
const updateFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string })?.id;

    const folderId = req.params?.id;
    const { name } = req.body as { name: string };

    if (!userId) {
      return httpResponse(req, res, 400, 'User ID is required');
    }

    if (!name) {
      return httpResponse(req, res, 400, 'Folder name is required');
    }

    const folder = await Folder.findByIdAndUpdate(folderId, { name }, { new: true });

    if (!folder) {
      return httpResponse(req, res, 404, 'Folder not found');
    }

    const user = await User.findById(userId).populate('folders');

    if (!user) {
      return httpResponse(req, res, 404, 'User not found');
    }

    httpResponse(req, res, 200, 'Folder updated successfully', user.folders);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

/**
 * Deletes a folder by its ID and removes its reference from the user.
 */
const deleteFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string })?.id;
    const folderId = req.params?.id;

    if (!userId) {
      return httpResponse(req, res, 400, 'User ID is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      return httpResponse(req, res, 404, 'User not found');
    }

    const folderIndex = user.folders.findIndex((id) => id.toString() === folderId);
    if (folderIndex === -1) {
      return httpResponse(req, res, 404, 'Folder not found');
    }

    user.folders.splice(folderIndex, 1);
    await user.save();
    await Folder.findByIdAndDelete(folderId);

    httpResponse(req, res, 200, 'Folder deleted successfully');
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

export default { getFolders, createFolder, updateFolder, deleteFolder };
