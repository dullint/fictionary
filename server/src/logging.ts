import { createLogger, format, transports } from 'winston';

const { label, simple, colorize, printf, combine } = format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const myformat = combine(
  simple(),
  colorize(),
  printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${level} ${message}  `;
    if (Object.keys(metadata).length) {
      msg += JSON.stringify(metadata);
    }
    return msg;
  })
);

const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  levels: logLevels,
  format: myformat,
  transports: [new transports.Console()],
});

export default logger;
