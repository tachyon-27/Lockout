import jwt from 'jsonwebtoken';

export const generateToken = (_id, expiresIn='30d') => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn,
    })
}