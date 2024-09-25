import routes from './routes';
import { SetUpApplicationService } from './services';

try {
  new SetUpApplicationService(routes).startApplication();
} catch (error) {
  console.error('Failed to start the application:', error);
}
