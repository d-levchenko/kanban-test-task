import { Router } from 'express';
import {
  createCard,
  deleteCard,
  moveCard,
  updateCard,
} from '../controllers/cardController.js';

const cardRouter = Router();

cardRouter.post('/:boardId/cards', createCard);
cardRouter.put('/:boardId/cards/:cardId', updateCard);
cardRouter.put('/:boardId/cards/:cardId/move', moveCard);
cardRouter.delete('/:boardId/cards/:cardId', deleteCard);

export default cardRouter;
