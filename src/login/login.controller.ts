import * as Boom from 'boom';
import { userModel, IUser } from './user.model';
import * as Hapi from 'hapi';
import { HashPassword } from '../utils/utils';
import { loginUtils } from './login.utils';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { ILoginRequest, IRequestAuth, IRequest } from '../interfaces/request';

export interface IUserPayload {
    login: string;
    password: string;
    confirmedPassword?: string;
}

class LoginController {
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

    public doLogin(payload: IUserPayload): Promise<string> {
        return new Promise((resolve, reject) => {
            userModel
                .findOne({ login: payload.login }, '_id login password')
                .then(user => {
                    if (user) {
                        bcrypt
                            .compare(payload.password, user.password)
                            .then(match => {
                                if (match) {
                                    resolve(loginUtils.generateToken(user));
                                } else {
                                    reject('Incorrect password');
                                }
                            })
                            .catch(error => {
                                reject(error);
                            });
                    } else {
                        reject('User not found');
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    public async addUser(request: ILoginRequest, h: Hapi.ResponseToolkit) {
        const userPayload: IUserPayload = {
            login: request.payload.login,
            password: request.payload.password,
            confirmedPassword: request.payload.confirmedPassword
        };
        if (userPayload.password !== userPayload.confirmedPassword) {
            return Boom.badData('your data is bad and you should feel bad');
        } else {
            try {
                const userToAdd: IUser = {
                    login: userPayload.login,
                    password: HashPassword(userPayload.password)
                };
                let user: any = await userModel.create(request.payload);
               // FIX ME
                return h.response({ token: this.generateToken(user) }).code(201);
            } catch (error) {
                return Boom.badImplementation(error);
            }
        }
    }
}

// Singleton
const loginController = new LoginController();

export { loginController as LoginController };
