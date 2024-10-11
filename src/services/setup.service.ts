require('dotenv').config();

import express, { Express, Router } from 'express';
import helmet from 'helmet';
import http from 'http';

import { cors, morgan } from '../middlewares';
import { setupSwagger } from '../utils';

export default class SetUpApplicationService {
  private _env: string | undefined;
  private _host: string | undefined;
  private _port: number | undefined;
  private _app: Express;
  private _routes: Router;
  private _initSwagger: boolean;

  constructor(routes: Router) {
    this._env = process.env.NODE_ENV;
    this._host = process.env.SERVER_HOST;
    this._port = Number(process.env.SERVER_PORT);
    this._initSwagger = this._env === 'development' || this._env === 'local';

    this._app = express();
    this._routes = routes;

    if (!this._env || !this._host || isNaN(this._port) || this._port <= 0) {
      throw new Error(
        'Environment variables NODE_ENV, SERVER_HOST, and SERVER_PORT must be defined and valid.'
      );
    }

    this.initialize();
  }

  private initialize() {
    this._app.use(express.json());
    this._app.use(cors.setUpCORS);
    this._app.use(cors.handleCorsError);
    this._app.use(helmet());
    morgan(this._app);

    if (this._initSwagger) {
      setupSwagger(this._app);
    }

    this._app.use(this._routes);
  }

  startApplication() {
    const httpServer = http.createServer(this._app);

    httpServer.listen(this._port, this._host, () => {
      console.log(
        `✅ Server is running at http://${this._host}:${this._port}/ using ${this._env} configuration.`
      );
      if (this._initSwagger) {
        console.log(
          `📘 Swagger docs are available at http://${this._host}:${this._port}/api-docs`
        );
      }
    });
  }
}
