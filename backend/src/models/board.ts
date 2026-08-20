import mongoose, { Schema } from 'mongoose';

export interface Board {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema<Board>(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: 'boards',
    timestamps: true,
    versionKey: false,
  },
);

export const Board: mongoose.Model<Board> =
  (mongoose.models.Board as mongoose.Model<Board> | undefined) ??
  mongoose.model<Board>('Board', boardSchema);
