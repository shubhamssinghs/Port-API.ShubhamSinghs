import swaggerJSDoc, { OAS3Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

import { version } from '../../package.json';

const options: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Port-API.ShubhamSinghs API Documentation',
      version,
      description:
        'API documentation for Port-API.ShubhamSinghs </br> Click the link to download the JSON file: <a href="/api/swagger.json">Download Swagger JSON</a>'
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

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app: Express) => {
  app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/api/swagger.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="swagger.json"');
    res.send(swaggerSpec);
  });
};

export default setupSwagger;
