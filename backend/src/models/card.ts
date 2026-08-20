import mongoose, { Schema, Types } from 'mongoose';

export type CardColumn = 'todo' | 'inprogress' | 'done';

export interface Card {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  boardId: string;
  column: CardColumn;
  index: number;
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new Schema<Card>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    boardId: {
      type: String,
      required: true,
      index: true,
    },
    column: {
      type: String,
      enum: ['todo', 'inprogress', 'done'],
      default: 'todo',
      required: true,
    },
    index: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    collection: 'cards',
    timestamps: true,
    versionKey: false,
  },
);

export const Card: mongoose.Model<Card> =
  (mongoose.models.Card as mongoose.Model<Card> | undefined) ??
  mongoose.model<Card>('Card', cardSchema);
