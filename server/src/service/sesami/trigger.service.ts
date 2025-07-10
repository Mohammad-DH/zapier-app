import { generateAuthCode } from '@/server/src/common/utils/generateAuthCode';
import {
    getShopByShopId,
    getShopServicesByAction,
    updateShopAuthCode,
} from '@/server/src/database';
import axios from 'axios';

export const handleTriggerAction = async (shopId: string, action: string) => {
    const services = await getShopServicesByAction(shopId, action);

    if (!services || (services && services.length === 0)) {
        console.log(services);

        throw new Error('No matching services found');
    }

    await Promise.allSettled(
        services.map((service: any) =>
            axios.post(service.url, { shopId, action }),
        ),
    );
};

export const handleGetShop = async (shopId: string) => {
    const shop = await getShopByShopId(shopId);

    if (!shop) {
        throw new Error('No matching shop found');
    }
    return shop;
};

export const handleRefreshAuthCode = async (shopId: string) => {
    const newAuthCode = await generateAuthCode(shopId);

    return await updateShopAuthCode(shopId, newAuthCode);
};
