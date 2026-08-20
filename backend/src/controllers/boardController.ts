import type { NextFunction, Request, Response } from 'express';

import { Board } from '../models/board.js';
import { Card } from '../models/card.js';
import { generateHashId } from '../utils/hash.js';

type BoardParams = {
  boardId: string;
};

type BoardBody = {
  name?: string;
};

export const getAllBoards = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const boards = await Board.find()
      .select('_id name createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      boards.map(board => ({
        id: board._id,
        name: board.name,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      })),
    );
  } catch (error) {
    next(error);
  }
};

export const getBoardById = async (
  req: Request<BoardParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const board = await Board.findById(req.params.boardId).lean();

    if (!board) {
      res.status(404).json({
        success: false,
        message: 'Board not found',
      });
      return;
    }

    const cards = await Card.find({ boardId: board._id })
      .select('_id title description column index createdAt updatedAt')
      .sort({ column: 1, index: 1 })
      .lean();

    res.json({
      board: {
        id: board._id,
        name: board.name,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      },
      cards: cards.map(card => ({
        id: card._id.toString(),
        title: card.title,
        description: card.description ?? '',
        column: card.column,
        index: card.index,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const createBoard = async (
  req: Request<Record<string, never>, unknown, BoardBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Board name is required',
      });
      return;
    }

    const board = await Board.create({
      _id: generateHashId(name),
      name,
    });

    res.status(201).json({
      id: board._id,
      name: board.name,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBoard = async (
  req: Request<BoardParams, unknown, BoardBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const name = req.body.name?.trim();

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Board name is required',
      });
      return;
    }

    const board = await Board.findByIdAndUpdate(
      req.params.boardId,
      { $set: { name } },
      { new: true, runValidators: true },
    ).lean();

    if (!board) {
      res.status(404).json({
        success: false,
        message: 'Board not found',
      });
      return;
    }

    res.json({
      id: board._id,
      name: board.name,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (
  req: Request<BoardParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const board = await Board.findByIdAndDelete(req.params.boardId);

    if (!board) {
      res.status(404).json({
        success: false,
        message: 'Board not found',
      });
      return;
    }

    await Card.deleteMany({ boardId: req.params.boardId });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
