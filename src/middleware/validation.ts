import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodIssue } from 'zod';

export const validateRequest = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: ZodIssue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }));
        
        return res.status(400).json({
          error: 'Validation failed',
          details: errorMessages
        });
      }
      
      // Handle other types of errors
      return res.status(500).json({
        error: 'Internal server error during validation'
      });
    }
  };
};

export const validateParams = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: ZodIssue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }));
        
        return res.status(400).json({
          error: 'Parameter validation failed',
          details: errorMessages
        });
      }
      
      return res.status(500).json({
        error: 'Internal server error during parameter validation'
      });
    }
  };
};