import * as mongoose from 'mongoose';
import * as Bcrypt from 'bcrypt';
import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import { HashPassword } from '../utils/utils';

export interface IUser {
    password: string;
    email: string;
}

export interface IUserDocument extends mongoose.Document, IUser {
    validatePassword(requestPassword): boolean;
}

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

schema.methods.validatePassword = function(requestPassword) {
    return Bcrypt.compareSync(requestPassword, this.password);
};

schema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    user.password = HashPassword(user.password);

    return next();
});

schema.pre('findOneAndUpdate', function() {
    const password = HashPassword(this.getUpdate().$set.password);

    if (!password) {
        return;
    }

    this.findOneAndUpdate({}, { password: password });
});

export const userModel = mongoose.model<IUserDocument>('User', schema);
