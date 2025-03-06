import { NextFunction, Request, Response } from 'express';
import Note from '../model/note.model';
import User from '../model/user.model';
import { INote } from '../types/types';
import httpError from '../utils/httpError';
import httpResponse from '../utils/httpResponse';

/**
 * Retrieves all notes associated with the authenticated user.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string })?.id;

    if (!userId) {
      return httpResponse(req, res, 400, 'User ID is missing');
    }

    const user = await User.findById(userId).populate('notes');
    if (!user) {
      return httpResponse(req, res, 404, 'User not found');
    }

    httpResponse(req, res, 200, 'Notes fetched successfully', user.notes);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

/**
 * Creates a new note and associates it with the authenticated user.
 * @param req - Express request object containing note details.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
const createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string })?.id;
    const { title, content, isPinned, isStarred, isArchived, isDeleted, folderId } = req.body as INote;

    if (!userId) {
      return httpResponse(req, res, 400, 'User ID is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      return httpResponse(req, res, 404, 'User not found');
    }

    const noteData = { title, content, isPinned, isStarred, isArchived, isDeleted, folderId };

    const note = new Note(noteData);
    await note.save();

    user.notes.push(note._id);
    await user.save();

    const updatedUser = await User.findById(userId).populate('notes');
    httpResponse(req, res, 201, 'Note created successfully', updatedUser?.notes);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

/**
 * Updates a note by its ID.
 * @param req - Express request object containing note ID and updated details.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
const updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string })?.id;

    const { id: noteId } = req.params;
    const { title, content, isPinned, isStarred, isArchived, isDeleted, folderId } = req.body as INote;

    if (!userId) {
      return httpResponse(req, res, 400, 'User ID is required');
    }

    const noteData = { title, content, isPinned, isStarred, isArchived, isDeleted, folderId };

    const note = await Note.findByIdAndUpdate(noteId, noteData, { new: true });
    if (!note) {
      return httpResponse(req, res, 404, 'Note not found');
    }

    const user = await User.findById(userId).populate('notes');

    httpResponse(req, res, 200, 'Note updated successfully', user?.notes);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

/**
 * Deletes a note by its ID and removes its reference from the user's notes.
 * @param req - Express request object containing note ID.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
const deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req.user as { id: string })?.id;
    const { id: noteId } = req.params;

    if (!userId) {
      return httpResponse(req, res, 400, 'User ID is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      return httpResponse(req, res, 404, 'User not found');
    }

    user.notes = user.notes.filter((id) => id.toString() !== noteId);
    await user.save();
    await Note.findByIdAndDelete(noteId);

    const updatedUser = await User.findById(userId).populate('notes');
    httpResponse(req, res, 200, 'Note deleted successfully', updatedUser?.notes);
  } catch (err) {
    httpError(next, err, req, 500);
  }
};

export default { getNotes, createNote, updateNote, deleteNote };
