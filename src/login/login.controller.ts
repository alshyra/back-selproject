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
        let user: IUser = await userModel.findById(id);
        return user;
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

    public addUser(request: ILoginRequest) {
        const userPayload: IUserPayload = {
            login: request.payload.login,
            password: request.payload.password,
            confirmedPassword: request.payload.confirmedPassword
        };
        return new Promise((resolve, reject) => {
            HashPassword(userPayload.password)
                .then(hashedPassword => {
                    const userToAdd: IUser = {
                        login: userPayload.login,
                        password: hashedPassword
                    };
                    const us = new userModel(userToAdd);
                    us
                        .save()
                        .then(res => {
                            resolve(res);
                        })
                        .catch(error => {
                            reject(error);
                        });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

// Singleton
const loginController = new LoginController();

export { loginController as LoginController };
