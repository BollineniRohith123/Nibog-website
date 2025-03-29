import { NextApiRequest, NextApiResponse } from 'next';

export function errorHandler(
  err: any, 
  req: NextApiRequest, 
  res: NextApiResponse
) {
  // Log the full error for debugging
  console.error('Unhandled Error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code,
  });

  // Prevent null payload errors
  if (err instanceof TypeError && err.message.includes('payload')) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during processing',
      details: 'Payload validation failed'
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
}

// Utility to wrap async route handlers
export const asyncHandler = (fn: any) => async (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  try {
    return await fn(req, res);
  } catch (error) {
    errorHandler(error, req, res);
  }
};
