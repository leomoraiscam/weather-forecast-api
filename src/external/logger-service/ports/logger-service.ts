export enum TypesLogger {
  INFO = 'info',
  WARN = 'warn',
  DEBUG = 'debug',
  TRACE = 'trace',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface LoggerData {
  level: TypesLogger;
  message: string;
  metadata?: object;
}

export interface LoggerService {
  log({ level, message, metadata }: LoggerData): void;
}
