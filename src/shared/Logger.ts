/**
 * Setup the winston logger.
 *
 * Documentation: https://github.com/winstonjs/winston
 */

import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
// Import Functions
const { File, Console } = transports;

const rotationTransport = new DailyRotateFile({
  filename: 'watchman-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d',
  dirname: './logs',
  auditFile: './logs/winston-audit.json'
});
// Init Logger
const logger = createLogger({
  level: 'info'
});

/**
 * For production write to all logs with level `info` and below
 * to `combined.log. Write all logs error (and below) to `error.log`.
 * For development, print to the console.
 */
if (process.env.NODE_ENV === 'production') {
  /*   const fileFormat = format.combine(format.timestamp(), format.json());
  const errTransport = new File({
    filename: './logs/error.log',
    format: fileFormat,
    level: 'error'
  });
  const infoTransport = new File({
    filename: './logs/info.log',
    format: fileFormat,
    level: 'info'
  });
  logger.add(errTransport);
  logger.add(infoTransport); */
  logger.add(rotationTransport);
} else {
  const errorStackFormat = format(info => {
    if (info.stack) {
      // tslint:disable-next-line:no-console
      console.log(info.stack);
      return false;
    }
    return info;
  });
  const consoleTransport = new Console({
    format: format.combine(format.colorize(), format.simple(), errorStackFormat())
  });
  logger.add(consoleTransport);
}

export default logger;
