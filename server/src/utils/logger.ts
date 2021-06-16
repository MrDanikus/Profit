import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from 'config';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = (): string => {
  return config.get('server.logger');
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'white',
  debug: 'blue',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
  winston.format.colorize({all: true}),
  winston.format.printf(
    info => `[${info.timestamp}] - - ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new DailyRotateFile({
    filename: 'logs/all-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '10d',
  }),
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;
