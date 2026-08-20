import type { NextFunction, Request, Response } from 'express';

type HttpError = Error & {
  statusCode?: number;
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const error = err instanceof Error ? err : new Error('Unknown error');
  const httpError = error as HttpError;
  const statusCode = httpError.statusCode ?? 500;

  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500 && process.env.NODE_ENV !== 'development'
        ? 'Internal Server Error'
        : error.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  });
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
