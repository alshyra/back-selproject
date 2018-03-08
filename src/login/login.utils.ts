import * as jwt from 'jsonwebtoken';
import { IUser } from './user.model';
import { Request, Base_Reply } from 'hapi';

const key = 'private key';

class LoginUtils {

    public verifyToken(token: string) {
        const decodedToken = jwt.verify(token, key);
        console.log(decodedToken);
    }

    public generateToken(user: IUser): string {
        return jwt.sign(JSON.stringify(user), key);
    }

}

const utils = new LoginUtils();

export {utils as loginUtils };
