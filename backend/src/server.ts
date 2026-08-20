import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';

// import { connectDB } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import boardRouter from './routes/board.js';
import cardRouter from './routes/card.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use('/api/boards', boardRouter);
app.use('/api/cards', cardRouter);

app.use(notFound);
app.use(errorHandler);

// await connectDB();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
});
