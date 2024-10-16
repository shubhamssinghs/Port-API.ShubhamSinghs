import swaggerJSDoc, { OAS3Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response } from 'express';

import { version } from '../../package.json';

const options: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Port-API.ShubhamSinghs',
      version,
      description:
        'API documentation for Port-API.ShubhamSinghs </br> Click the link to download the JSON file: <a href="/swagger/Port-API.ShubhamSinghs.json">Download Port-API.ShubhamSinghs JSON</a>'
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
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/swagger/Port-API.ShubhamSinghs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Port-API.ShubhamSinghs.json"'
    );
    res.send(swaggerSpec);
  });

  app.get('/', (_req: Request, res: Response) => {
    console.log('Redirecting to /api-docs');
    res.redirect('/api-docs');
  });
};

export default setupSwagger;
