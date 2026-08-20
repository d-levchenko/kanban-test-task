import { Router } from 'express';
import {
  createBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from '../controllers/boardController.js';

const boardRouter = Router();

boardRouter.get('/', getAllBoards);
boardRouter.get('/:boardId', getBoardById);
boardRouter.post('/', createBoard);
boardRouter.put('/:boardId', updateBoard);
boardRouter.delete('/:boardId', deleteBoard);

export default boardRouter;
