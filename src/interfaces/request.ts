import * as Hapi from 'hapi';
import { IUserPayload } from '../user/user.controller';

export interface ICredentials extends Hapi.AuthCredentials {
    id: string;
}

export interface IRequestAuth extends Hapi.RequestAuth {
    credentials: ICredentials;
}

export interface IRequest extends Hapi.Request {
    auth: IRequestAuth;
}

export interface ILoginRequest extends IRequest {
    payload: IUserPayload;
}

export interface IUserRequest extends IRequest {
    userId: string;
}
