import { createLogger, format, transports } from 'winston';

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  levels: logLevels,
  format: format.cli(),
  transports: [new transports.Console()],
});

export default logger;
