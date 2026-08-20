import type { NextFunction, Request, Response } from 'express';

import { Board } from '../models/board.js';
import { Card, type CardColumn } from '../models/card.js';

type BoardParams = {
  boardId: string;
};

type CardParams = {
  boardId: string;
  cardId: string;
};

type CreateCardBody = {
  title?: string;
  description?: string;
  column?: CardColumn;
};

type UpdateCardBody = {
  title?: string;
  description?: string;
  column?: CardColumn;
  index?: number;
};

type MoveCardBody = {
  column?: CardColumn;
  index?: number;
};

const toCardResponse = (card: {
  _id: { toString(): string };
  title: string;
  description?: string;
  boardId: string;
  column: CardColumn;
  index: number;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: card._id.toString(),
  title: card.title,
  description: card.description ?? '',
  boardId: card.boardId,
  column: card.column,
  index: card.index,
  createdAt: card.createdAt,
  updatedAt: card.updatedAt,
});

export const createCard = async (
  req: Request<BoardParams, unknown, CreateCardBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      res.status(404).json({
        success: false,
        message: 'Board not found',
      });
      return;
    }

    const title = req.body.title?.trim();

    if (!title) {
      res.status(400).json({
        success: false,
        message: 'Card title is required',
      });
      return;
    }

    const column = req.body.column ?? 'todo';

    const lastCard = await Card.findOne({
      boardId: board._id,
      column,
    })
      .sort({ index: -1 })
      .lean();

    const card = await Card.create({
      title,
      description: req.body.description?.trim() ?? '',
      boardId: board._id,
      column,
      index: lastCard ? lastCard.index + 1 : 0,
    });

    res.status(201).json(toCardResponse(card));
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (
  req: Request<CardParams, unknown, UpdateCardBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const updates: UpdateCardBody = {};

    if (req.body.title !== undefined) {
      const title = req.body.title.trim();

      if (!title) {
        res.status(400).json({
          success: false,
          message: 'Card title cannot be empty',
        });
        return;
      }

      updates.title = title;
    }

    if (req.body.description !== undefined) {
      updates.description = req.body.description.trim();
    }

    if (req.body.column !== undefined) {
      updates.column = req.body.column;
    }

    if (req.body.index !== undefined) {
      if (!Number.isInteger(req.body.index) || req.body.index < 0) {
        res.status(400).json({
          success: false,
          message: 'Card index must be a non-negative integer',
        });
        return;
      }

      updates.index = req.body.index;
    }

    const card = await Card.findOneAndUpdate(
      {
        _id: req.params.cardId,
        boardId: req.params.boardId,
      },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!card) {
      res.status(404).json({
        success: false,
        message: 'Card not found',
      });
      return;
    }

    if (updates.column !== undefined || updates.index !== undefined) {
      await reindexCards(req.params.boardId, card.column);
    }

    const updatedCard = await Card.findById(card._id).lean();

    if (!updatedCard) {
      res.status(404).json({
        success: false,
        message: 'Card not found',
      });
      return;
    }

    res.json(toCardResponse(updatedCard));
  } catch (error) {
    next(error);
  }
};

export const moveCard = async (
  req: Request<CardParams, unknown, MoveCardBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { column, index } = req.body;

    if (
      column === undefined ||
      index === undefined ||
      !Number.isInteger(index) ||
      index < 0
    ) {
      res.status(400).json({
        success: false,
        message: 'Column and a non-negative integer index are required',
      });
      return;
    }

    const card = await Card.findOneAndUpdate(
      {
        _id: req.params.cardId,
        boardId: req.params.boardId,
      },
      { $set: { column, index } },
      { new: true, runValidators: true },
    );

    if (!card) {
      res.status(404).json({
        success: false,
        message: 'Card not found',
      });
      return;
    }

    await reindexCards(req.params.boardId, column);

    const updatedCard = await Card.findById(card._id).lean();

    if (!updatedCard) {
      res.status(404).json({
        success: false,
        message: 'Card not found',
      });
      return;
    }

    res.json(toCardResponse(updatedCard));
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (
  req: Request<CardParams>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      res.status(404).json({
        success: false,
        message: 'Board not found',
      });
      return;
    }

    const card = await Card.findOneAndDelete({
      _id: req.params.cardId,
      boardId: board._id,
    });

    if (!card) {
      res.status(404).json({
        success: false,
        message: 'Card not found',
      });
      return;
    }

    await reindexCards(req.params.boardId, card.column);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

async function reindexCards(
  boardId: string,
  column: CardColumn,
): Promise<void> {
  const cards = await Card.find({ boardId, column })
    .sort({ index: 1, createdAt: 1 })
    .exec();

  await Promise.all(
    cards.map((card, index) => {
      card.index = index;
      return card.save();
    }),
  );
}
