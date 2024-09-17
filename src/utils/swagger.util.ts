import swagerJSDoc, { OAS3Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import config from 'config';

import { version } from '../../package.json';

const environment = config.get<string>('environment');
const isDev = environment === 'development';

const port = config.get<number>('server.port');
const host = config.get<number>('server.host');

const options: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth-m API Documentation',
      version,
      description: `API documentation for Auth-m project </br> Click the link to download the JSON file: <a href="https://${host}:${port}/api/swagger.json">Download Swagger JSON</a>`
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer'
        }
      }
    }
  },
  apis: ['./src/docs/*.yaml']
};

const swaggerSpec = swagerJSDoc(options);

const setupSwagger = (app: Express) => {
  if (isDev) {
    app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get('/api/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="swagger.json"'
      );
      res.send(swaggerSpec);
    });
  }
};

export default setupSwagger;
