import { Request, Response } from 'express';
import { handleSubscribe, handleUnsubscribe } from '@/server/src/service';

export const subscribe = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const { hookUrl, trigger } = req.body;

        if (!authHeader)
            return res.status(401).json({ error: 'missing_authorization' });
        if (!hookUrl || !trigger)
            return res.status(400).json({ error: 'invalid request' });

        const result = await handleSubscribe(authHeader, hookUrl, trigger);
        if (result) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json('failed to finish the process');
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const unsubscribe = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const { hookUrl, trigger } = req.body;

        if (!authHeader)
            return res.status(401).json({ error: 'missing_authorization' });
        if (!hookUrl || !trigger)
            return res.status(400).json({ error: 'invalid request' });

        const result = await handleUnsubscribe(authHeader, hookUrl, trigger);
        if (result) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json('failed to finish the process');
        }
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const list = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({ error: 'missing_authorization' });

        // Simulated data - replace this with DB query or real logic
        const events = [
            {
                id: 'srv_001',
                action: 'order.created',
                url: 'https://example.com/webhooks/order-created',
            },
            {
                id: 'srv_002',
                action: 'customer.updated',
                url: 'https://example.com/webhooks/customer-updated',
            },
        ];

        res.json(events);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
