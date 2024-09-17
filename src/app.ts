import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { cors, morgan } from './middlewares';
import routes from './routes';
import { setupSwagger } from './utils';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors);
app.use(helmet());
morgan(app);
setupSwagger(app);

app.get('/', (_req, res) => {
  res.redirect('/api');
});

app.use('/api', routes);

export default app;
