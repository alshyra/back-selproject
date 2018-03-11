import { UserRoutes } from './user/user.routes';
import { ServerRoute } from 'hapi';

const routes: ServerRoute[] = [...UserRoutes];

export { routes as Routes };
