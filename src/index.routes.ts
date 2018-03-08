import { RouteConfiguration } from 'hapi';
import { LoginRoutes } from './login/login.routes';

const routes: RouteConfiguration[] = [
    ...LoginRoutes,
];

export { routes as Routes };
