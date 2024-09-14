import request from 'supertest';
import express, { Application } from 'express';

import { logController } from '../controllers';
import { Log } from '../models';
import { httpStatus, errorMessages } from '../constants';

jest.mock('../models/log.model');

const app: Application = express();
app.use(express.json());

const logRoute = '/api/log/all';

app.get(logRoute, logController.getAllLogs);

describe('Log Controller', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should return all logs successfully', async () => {
    const mockLogs = [
      {
        uuid: '5f29cba3-acf8-4797-b649-c342608e2e9d',
        log: '"{\\"remote-addr\\":\\"::1\\",\\"remote-user\\":\\"-\\",\\"log-date-time\\":\\"[2024-05-22 09:52:08]\\",\\"method\\":\\"GET\\",\\"url\\":\\"/api/v1/asdad\\",\\"http-version\\":\\"1.1\\",\\"status\\":\\"404\\",\\"content-length\\":\\"151\\",\\"user-agent\\":\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\\",\\"response-time\\":\\"0.663 ms\\"}\\n"',
        created_at: '2024-05-22 04:22:08',
        updated_at: '2024-05-22 04:22:08'
      },
      {
        uuid: '607f7e09-443f-49e5-a82a-8fef3ecdf8a9',
        log: '"{\\"remote-addr\\":\\"::1\\",\\"remote-user\\":\\"-\\",\\"log-date-time\\":\\"[2024-05-22 09:52:08]\\",\\"method\\":\\"GET\\",\\"url\\":\\"/api/v1/asdad\\",\\"http-version\\":\\"1.1\\",\\"status\\":\\"404\\",\\"content-length\\":\\"151\\",\\"user-agent\\":\\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36\\",\\"response-time\\":\\"1.325 ms\\"}\\n"',
        created_at: '2024-05-22 04:22:08',
        updated_at: '2024-05-22 04:22:08'
      }
    ];

    (Log.findAll as jest.Mock).mockResolvedValue(mockLogs);

    const response = await request(app).get(logRoute);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.logs).toEqual(mockLogs);
    expect(Log.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle errors when retrieving logs', async () => {
    const error = new Error(errorMessages.InternalServerError);
    (Log.findAll as jest.Mock).mockRejectedValue(error);

    const response = await request(app).get(logRoute);

    expect(response.status).toBe(httpStatus.InternalServerError);
    expect(response.body.error).toEqual(errorMessages.InternalServerError);
    expect(Log.findAll).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});
