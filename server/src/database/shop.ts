import prisma from './prismaClient';

export async function createShop(shopId: string, authCode: string) {
    return await prisma.shop.create({
        data: {
            shopId,
            authCode,
        },
    });
}

export async function getShopByShopId(shopId: string) {
    return await prisma.shop.findUnique({
        where: { shopId },
        include: {
            services: true,
        },
    });
}

export async function getShopByAuthCode(authCode: string) {
    return await prisma.shop.findUnique({
        where: { authCode },
        include: {
            services: true,
        },
    });
}

export async function updateShopAuthCode(
    shopId: string,
    newAuthCode: string | null = null,
) {
    return await prisma.shop.update({
        where: { shopId },
        data: { authCode: newAuthCode },
    });
}

export async function deleteShop(shopId: string) {
    return await prisma.shop.delete({
        where: { shopId },
    });
}

export async function addServiceToShop(
    id: string,
    url: string,
    action: string,
) {
    return await prisma.service.create({
        data: {
            url,
            action,
            shop: {
                connect: { id },
            },
        },
    });
}

export async function getShopServicesByAction(shopId: string, action: string) {
    try {
        const service = await prisma.service.findMany({
            where: {
                action,
                shop: {
                    shopId,
                },
            },
            include: {
                shop: true,
            },
        });

        return service;
    } catch (error) {
        console.error('Error finding service:', error);
        throw error;
    }
}

export async function deleteShopServices(
    shopId: string,
    url: string,
    action: string,
) {
    try {
        const serviceToDelete = await prisma.service.findFirst({
            where: {
                url,
                action,
                shop: {
                    shopId,
                },
            },
        });

        if (!serviceToDelete) throw new Error('Service not found');

        const deleted = await prisma.service.delete({
            where: {
                id: serviceToDelete.id,
            },
        });

        return deleted;
    } catch (error) {
        console.error('Error finding service:', error);
        throw error;
    }
}
