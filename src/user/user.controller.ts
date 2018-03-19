import * as Boom from 'boom';
import { userModel, IUser } from './user.model';
import * as Jwt from 'jsonwebtoken';
import * as Hapi from 'hapi';
import { HashPassword } from '../utils/utils';
import { loginUtils } from './user.utils';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { ILoginRequest, IRequestAuth, IRequest } from '../interfaces/request';

export interface IUserPayload {
    email: string;
    password: string;
    confirmedPassword?: string;
}

export class UserController {
    public async getUser(request: IRequest, h: Hapi.ResponseToolkit) {
        const id = request.params.userId;
        console.log(`looking for user ${id}`);
        const user: IUser = await userModel.findById(id).exec();
        return user;
    }

    public async getUsers(request: IRequest, h: Hapi.ResponseToolkit) {
        console.log('getUsers');
        const users: IUser[] = await userModel.find({}).exec();
        return users;
    }

    public async doLogin(request: ILoginRequest, reply: Hapi.ResponseToolkit) {
        console.log('doLogin');
        const { email, password } = request.payload;

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return Boom.unauthorized('User does not exists.');
        }

        if (!user.validatePassword(password)) {
            return Boom.unauthorized('Password is invalid.');
        }
        console.log('before rep');
        const rep = reply
            .response({ token: loginUtils.generateToken(user) })
            .code(200);
        return rep;
    }

    public async createUser(request: ILoginRequest, h: Hapi.ResponseToolkit) {
        const userPayload: IUserPayload = {
            email: request.payload.email,
            password: request.payload.password,
            confirmedPassword: request.payload.confirmedPassword
        };
        if (
            userPayload.confirmedPassword &&
            userPayload.password !== userPayload.confirmedPassword
        ) {
            return Boom.badData('your data is bad and you should feel bad');
        } else {
            try {
                const userToAdd: IUser = {
                    email: userPayload.email,
                    password: HashPassword(userPayload.password)
                };
                let user: any = await userModel.create(request.payload);
                return h
                    .response({ token: loginUtils.generateToken(user) })
                    .code(201);
            } catch (error) {
                return Boom.badImplementation(error);
            }
        }
    }

    public async updateUser(request: ILoginRequest, h: Hapi.ResponseToolkit) {
        const userPayload: IUserPayload = {
            email: request.payload.email,
            password: request.payload.password
        };
        try {
            const id = request.auth.credentials.id;
            try {
                let user = await userModel.findByIdAndUpdate(
                    id,
                    { $set: userPayload },
                    { new: true }
                );
                return user;
            } catch (error) {
                return Boom.badImplementation(error);
            }
        } catch (error) {
            return Boom.badImplementation(error);
        }
    }
}
