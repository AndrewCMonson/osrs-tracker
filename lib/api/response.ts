import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(
    { success: true, ...(typeof data === 'object' && data !== null ? data : { data }) },
    { status }
  );
}

export function errorResponse(
  error: string,
  status = 400,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(process.env.NODE_ENV === 'development' && details && { details }),
    },
    { status }
  );
}

export function unauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = 'Forbidden'): NextResponse {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = 'Resource not found'): NextResponse {
  return errorResponse(message, 404);
}

export function internalErrorResponse(
  message = 'Internal server error',
  details?: unknown
): NextResponse {
  return errorResponse(message, 500, details);
}

