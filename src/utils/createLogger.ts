import winston, { Logger as WinstonLogger, LoggerOptions } from 'winston';

const { Console } = winston.transports;
const { combine, colorize, label, prettyPrint, printf } = winston.format;

const loggerFormat = printf(info => {
  return (info.label && info.label.trim().length > 0) ?  `[${info.label}]
${info.level}: ${info.message}` : `${info.level}: ${info.message}`;
});


const loggerDefaultFormat = (prefix: string = '') => combine(
  colorize(),
  label({ label: prefix }),
  prettyPrint(),
  loggerFormat,
)

const defaultTransports = [ new Console() ];

const opts: LoggerOptions = {
  exitOnError: false,
  format: loggerDefaultFormat(),
  transports: defaultTransports,
};

export const createLogger = () => {
  return winston.createLogger(opts);
};

export type Logger = WinstonLogger;
