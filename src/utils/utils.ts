import * as bcrypt from 'bcrypt';

const hashPassword = (password: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        bcrypt.genSalt(10, (saltErr, salt) => {
            bcrypt.hash(password, salt, (hasErr, hash) => {
                if (hasErr) {
                    reject(hasErr);
                } else {
                    resolve(hash);
                }
            });
        });
    });
};

export { hashPassword as HashPassword };
