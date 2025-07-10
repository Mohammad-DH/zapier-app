import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

type TokenPayload = {
    shopId: string;
};

export const generateAccessToken = async (shopId: string) => {
    return jwt.sign({ shopId }, SECRET_KEY, { expiresIn: '1h' });
};
export const generateRefreshToken = async (shopId: string) => {
    return jwt.sign({ shopId }, SECRET_KEY, { expiresIn: '1h' });
};

export const verifyAccessToken = async (
    token: string,
): Promise<TokenPayload | null> => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        if (typeof decoded === 'object' && 'shopId' in decoded) {
            return decoded as TokenPayload;
        }
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const verifyRefreshToken = async (
    token: string,
): Promise<TokenPayload | null> => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        if (typeof decoded === 'object' && 'shopId' in decoded) {
            return decoded as TokenPayload;
        }
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
};
