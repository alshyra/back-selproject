import * as Bcrypt from 'bcrypt';

const hashPassword = (password: string) => {
    const salt = Bcrypt.genSaltSync(10);
    return Bcrypt.hashSync(password, salt);
};

export { hashPassword as HashPassword };
