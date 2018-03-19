import * as jwt from 'jsonwebtoken';
import { IUser } from './user.model';
import { Request } from 'hapi';

export const secretKey = 'private key';

class LoginUtils {

    public verifyToken(token: string) {
        const decodedToken = jwt.verify(token, secretKey);
    }

    public generateToken(user: IUser): string {
        return jwt.sign(JSON.stringify(user), secretKey);
    }

}

const utils = new LoginUtils();

export {utils as loginUtils };
