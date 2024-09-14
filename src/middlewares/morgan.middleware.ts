/* eslint-disable indent */
import { Express, Request } from 'express';
import config from 'config';
import morgan from 'morgan';
import json from 'morgan-json';
import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import { Writable } from 'stream';
import uuid from 'node-uuid';

const loggingLevel = config.get<string>('logging.level');
const loggingTimezone = config.get<string>('logging.timezone');

class DBStream extends Writable {
  async _write(chunk: Buffer, _: unknown, callback: () => void) {
    if (loggingLevel === 'database') {
      try {
        // Import Log dynamically to prevent Sequelize errors when database is not set up
        const Log = (await import('../models/log.model')).default;
        await Log.create({ log: chunk.toString() });
        callback();
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        callback(error);
      }
    } else {
      // If logging level is not set to 'database', simply call the callback
      callback();
    }
  }
}

class FileStream extends Writable {
  _write(chunk: Buffer, _: unknown, callback: () => void) {
    const line = chunk.toString();
    const dir = path.join(__dirname, '../../', 'log');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(path.join(dir, 'access.log'), line);
    callback();
  }
}

const formatDatabase = json({
  'remote-addr': ':remote-addr',
  'remote-user': ':remote-user',
  'log-date-time': '[:date]',
  method: ':method',
  url: ':url',
  'http-version': ':http-version',
  status: ':status',
  'content-length': ':res[content-length]',
  'user-agent': ':user-agent',
  'response-time': ':response-time ms'
});

const formatFile =
  ':id\tREMOTE_ADDRESS/:remote-addr\tREMOTE_USER/:remote-user\t[:date]\tMETHOD/:method\t:url\tSTATUS_CODE/:status\tCONTENT_LENGTH/:res[content-length]\tREFERANCE/:referrer\tUSER_AGENT/:user-agent\tHTTP/:http-version';

morgan.token('id', () => uuid.v4());

morgan.token('date', () => {
  return moment().tz(loggingTimezone).format('YYYY-MM-DD HH:mm:ss');
});

const logger = (app: Express) => {
  const logger_mode = loggingLevel;
  if (!logger_mode) return;
  switch (logger_mode) {
    // eslint-disable-next-line indent
    case 'file':
      app.use(
        morgan(formatFile, {
          stream: new FileStream(),
          skip: (req: Request) => {
            const skipEndpoints = ['/logs', '/docs'];
            return skipEndpoints.some((endpoint) =>
              req.originalUrl.includes(endpoint)
            );
          }
        })
      );
      break;
    case 'database':
      app.use(
        morgan(formatDatabase, {
          stream: new DBStream(),
          skip: (req: Request) => {
            const skipEndpoints = ['/logs', '/docs'];
            return skipEndpoints.some((endpoint) =>
              req.originalUrl.includes(endpoint)
            );
          }
        })
      );
      break;
    case 'default':
      app.use(morgan('short'));
      break;
    default:
      return;
  }
};

export default logger;
