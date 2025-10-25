import {createLogger, format, transports} from 'winston';

const {combine, timestamp, printf, colorize, errors} = format;

export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({stack: true}),
    timestamp(),
    printf(({level, message, timestamp: ts, stack}) =>
      stack ? `${ts} [${level}]: ${message}\n${stack}` : `${ts} [${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), format.simple())
    })
  ]
});
