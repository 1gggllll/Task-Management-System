import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../errors/AppError';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params
      },
      {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
      }
    );

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      throw new AppError(errorMessage, 400);
    }

    next();
  };
};