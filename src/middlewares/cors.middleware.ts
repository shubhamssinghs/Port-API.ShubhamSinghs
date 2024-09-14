import cors, { CorsOptions } from 'cors';
import config from 'config';

const allowedOrigins = config.get<string[]>('cors.origins');
const environment = config.get<string>('environment');

const isDevelopment = environment === 'development';

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if ((origin && allowedOrigins.includes(origin)) || isDevelopment) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

export default cors(corsOptions);
