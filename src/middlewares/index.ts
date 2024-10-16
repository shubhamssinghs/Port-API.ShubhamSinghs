import cors from './cors.middleware';
import morgan from './morgan.middleware';
import * as auth from './auth.middleware';
import * as permission from './permission.middleware';

export { cors, morgan, auth, permission };
