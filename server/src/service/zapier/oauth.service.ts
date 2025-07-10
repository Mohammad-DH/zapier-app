import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '@/server/src/common/utils/generateToken';
import {
    getShopByAuthCode,
    getShopByShopId,
    updateShopAuthCode,
} from '@/server/src/database';

export const handleAuthorization = async ({
    redirectUri,
    state,
    auth_code,
}: {
    redirectUri: string;
    state?: string;
    auth_code: string;
}) => {
    // find the shop
    const shop = await getShopByAuthCode(auth_code);

    if (shop) {
        // create the redirect link
        const url = new URL(redirectUri);
        url.searchParams.set('code', auth_code);
        if (state) url.searchParams.set('state', state);

        return { redirectUrl: url.toString() };
    }

    throw new Error('shop was not found');
};

export const handleToken = async ({
    grantType,
    code,
    refreshToken,
}: {
    grantType: string;
    code?: string;
    refreshToken?: string;
}) => {
    if (grantType === 'authorization_code' && code) {
        // find the shop with this authCode
        const shop = await getShopByAuthCode(code);

        if (!shop) throw new Error('invalid_grant');

        await updateShopAuthCode(shop.shopId);

        const access_token = await generateAccessToken(shop.shopId);
        const new_refresh_token = await generateRefreshToken(shop.shopId);

        return {
            access_token,
            token_type: 'Bearer',
            expires_in: 3600, // Token expiration in seconds
            refresh_token: new_refresh_token,
            shopId: shop.shopId,
        };
    } else if (grantType === 'refresh_token' && refreshToken) {
        const tokenInfo = await verifyRefreshToken(refreshToken);
        if (!tokenInfo) throw new Error('invalid request');

        const access_token = await generateAccessToken(tokenInfo.shopId);

        return {
            access_token,
            token_type: 'Bearer',
            expires_in: 3600,
        };
    } else {
        throw new Error('unsupported_grant_type');
    }
};

export const handleMe = async (authHeader: string) => {
    const token = authHeader.replace('Bearer ', '');

    const tokenInformation = await verifyRefreshToken(token);

    if (!tokenInformation) throw new Error('invalid_token');

    const shop = await getShopByShopId(tokenInformation.shopId);

    if (!shop) throw new Error('invalid_request');

    return shop;
};
