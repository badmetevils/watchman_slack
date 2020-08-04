import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import logger from '@shared/Logger';

// Init express
const expressApp = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  expressApp.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
  expressApp.use(helmet());
}

// Add APIs
expressApp.use('/api/v1', BaseRouter);

// Print API errors
expressApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err);
  return res.status(BAD_REQUEST).json({
    error: err.message
  });
});

// Export express instance
export default expressApp;
