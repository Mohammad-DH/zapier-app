import {
    handleGetShop,
    handleRefreshAuthCode,
    handleTriggerAction,
} from '@/server/src/service';
import { Request, Response } from 'express';

export const triggerAction = async (req: Request, res: Response) => {
    try {
        const { shopId, action } = req.body;
        if (!shopId || !action) {
            return res
                .status(400)
                .json({ error: 'shopId and action are required' });
        }

        res.sendStatus(204);

        await handleTriggerAction(shopId as string, action as string);
    } catch (err: any) {
        console.log(err);
    }
};

export const getShop = async (req: Request, res: Response) => {
    try {
        const { shopId } = req.body;

        if (!shopId) {
            return res.status(400).json({ error: 'shopId is required' });
        }

        const shop = await handleGetShop(shopId as string);
        res.status(200).json(shop);
    } catch (err: any) {
        console.log(err);
        res.status(400).json({ error: 'no matching shop' });
    }
};

export const refreshAuthCode = async (req: Request, res: Response) => {
    try {
        const { shopId } = req.body;

        if (!shopId) {
            return res.status(400).json({ error: 'shopId is required' });
        }

        const shop = await handleRefreshAuthCode(shopId as string);
        res.status(200).json(shop);
    } catch (err: any) {
        console.log(err);
        res.status(400).json({ error: 'no matching shop' });
    }
};
