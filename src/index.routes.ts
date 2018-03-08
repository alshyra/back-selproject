import { LoginRoutes } from './login/login.routes';
import { ServerRoute } from 'hapi';

const routes: ServerRoute[] = [...LoginRoutes];

export { routes as Routes };
