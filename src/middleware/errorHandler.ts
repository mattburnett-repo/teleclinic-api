import { Request, Response, NextFunction } from 'express'

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message
    })
  }

  // Default to 500 server error
  console.error(err)
  res.status(500).json({
    error: 'Internal server error'
  })
} 