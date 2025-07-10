import {
    addServiceToShop,
    getShopByShopId,
    deleteShopServices,
} from '@/server/src/database';
import { verifyAccessToken } from '@/server/src/common/utils/generateToken';

export const handleSubscribe = async (
    authHeader: string,
    hookUrl: string,
    trigger: string,
) => {
    const token = authHeader.replace('Bearer ', '');
    const tokenInformation = await verifyAccessToken(token);
    if (!tokenInformation) throw new Error('invalid_token');

    const shop = await getShopByShopId(tokenInformation.shopId);
    if (!shop) throw new Error('invalid_request');

    // Check if service with same URL exists
    const existing = shop.services.find((s: any) => s.url === hookUrl);
    if (existing) throw new Error('invalid_request_this_URL_already_exists');

    //! send a request to the event system to subscribe

    const service = await addServiceToShop(shop.id, hookUrl, trigger);

    if (service) {
        return service;
    } else {
        return false;
    }
};
export const handleUnsubscribe = async (
    authHeader: string,
    hookUrl: string,
    trigger: string,
) => {
    const token = authHeader.replace('Bearer ', '');
    const tokenInformation = await verifyAccessToken(token);
    if (!tokenInformation) throw new Error('invalid_token');

    const result = await deleteShopServices(
        tokenInformation.shopId,
        hookUrl,
        trigger,
    );

    return result;
};
