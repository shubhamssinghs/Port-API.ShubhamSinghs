require('dotenv').config();

/* eslint-disable indent */
import { Express, Request } from 'express';
import morgan from 'morgan';
import json from 'morgan-json';
import fs from 'fs';
import path from 'path';
import { Writable } from 'stream';
import uuid from 'node-uuid';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sanitize from '../utils/sanitize.utils';

const loggingLevel = process.env.LOG_LEVEL || 'default';

class DBStream extends Writable {
  async _write(chunk: Buffer, _: unknown, callback: () => void) {
    if (loggingLevel === 'database') {
      try {
        // Import Log dynamically to prevent Sequelize errors when database is not set up
        const Log = (await import('../models/log.model')).default;
        const logData = JSON.parse(chunk.toString('utf-8'));
        await Log.create({ log: logData });
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

morgan.token('id', () => uuid.v4());

morgan.token('user', (req: Request) => {
  const authHeader =
    (req.headers['authorization'] as string) ||
    (req.headers['Authorization'] as string);

  if (!authHeader) return 'Guest';

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    const user = decoded as JwtPayload;
    return user.email || 'Unknown User';
  } catch (error) {
    return 'Invalid Token';
  }
});

morgan.token('payload', (req: Request) => {
  const sanitizedBody = sanitize(req.body, ['password']);
  return JSON.stringify(sanitizedBody);
});

morgan.token('referer', (req: Request) => {
  return req.get('Referer') || '-';
});

morgan.token('response-headers', (_req, res) => {
  const sanitizedHeaders = sanitize(res.getHeaders(), [
    'set-cookie',
    'access-control-allow-origin'
  ]);
  return JSON.stringify(sanitizedHeaders);
});

const formatDatabase = json({
  'user-email': ':user',
  'remote-addr': ':remote-addr',
  method: ':method',
  url: ':url',
  'http-version': ':http-version',
  status: ':status',
  'content-length': ':res[content-length]',
  'user-agent': ':user-agent',
  'response-time': ':response-time ms',
  payload: ':payload',
  referer: ':referer',
  'response-headers': ':response-headers'
});

const formatFile =
  ':id\t' +
  'REMOTE_ADDRESS/:remote-addr\t' +
  'REMOTE_USER/:remote-user\t' +
  'USER_EMAIL/:user\t' +
  'METHOD/:method\t' +
  ':url\t' +
  'STATUS_CODE/:status\t' +
  'CONTENT_LENGTH/:res[content-length]\t' +
  'REFERANCE/:referrer\t' +
  'USER_AGENT/:user-agent\t' +
  'HTTP/:http-version\t' +
  'PAYLOAD/:payload';
+'RESPONSE_HEADERS/:response-headers';

const skipEndpoints = [/^\/log\//, /^\/docs\//];

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
            return skipEndpoints.some((regex) => regex.test(req.originalUrl));
          }
        })
      );
      break;
    case 'database':
      app.use(
        morgan(formatDatabase, {
          stream: new DBStream(),
          skip: (req: Request) => {
            return skipEndpoints.some((regex) => regex.test(req.originalUrl));
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
