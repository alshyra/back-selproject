import * as mongoose from 'mongoose';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';

export interface IUser {

    login: string;
    password: string;
    email?: string;

}

export interface IUserDocument extends mongoose.Document, IUser {}

const schema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: String,
});

export const userModel = mongoose.model<IUserDocument>('User', schema);
