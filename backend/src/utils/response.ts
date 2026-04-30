import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

/**
 * Send success response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  status: number = 200
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  } as ApiResponse<T>);
}

/**
 * Send error response
 */
export function sendError(
  res: Response,
  error: string,
  status: number = 400,
  errors?: Record<string, string>
) {
  return res.status(status).json({
    success: false,
    error,
    errors,
  } as ApiResponse);
}

/**
 * Send validation error response
 */
export function sendValidationError(
  res: Response,
  errors: Record<string, string>
) {
  return res.status(422).json({
    success: false,
    error: 'Validation failed',
    errors,
  } as ApiResponse);
}

/**
 * Send unauthorized response
 */
export function sendUnauthorized(
  res: Response,
  message: string = 'Unauthorized'
) {
  return sendError(res, message, 401);
}

/**
 * Send forbidden response
 */
export function sendForbidden(
  res: Response,
  message: string = 'Forbidden'
) {
  return sendError(res, message, 403);
}

/**
 * Send not found response
 */
export function sendNotFound(
  res: Response,
  message: string = 'Resource not found'
) {
  return sendError(res, message, 404);
}

/**
 * Send server error response
 */
export function sendServerError(
  res: Response,
  message: string = 'Internal server error'
) {
  return sendError(res, message, 500);
}
