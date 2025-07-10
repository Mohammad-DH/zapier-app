import { randomBytes, createHash } from 'crypto';

export async function generateAuthCode(shopId: string) {
    const key = process.env.AuthCodeKey;
    const randomSalt = randomBytes(8).toString('hex'); // different each time
    const raw = `${shopId}:${key}:${randomSalt}`;
    return createHash('sha256').update(raw).digest('hex').slice(0, 12);
}
