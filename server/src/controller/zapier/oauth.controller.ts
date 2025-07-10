import { Request, Response } from 'express';
import {
    handleAuthorization,
    handleMe,
    handleToken,
} from '@/server/src/service';

export const authorize = async (req: Request, res: Response) => {
    try {
        const { client_id, redirect_uri, response_type, state, auth_code } =
            req.query;

        if (!client_id || !redirect_uri || !response_type || !auth_code) {
            return res.status(400).send('Missing required parameters');
        }

        if (client_id !== process.env.CLIENT_ID || response_type !== 'code') {
            return res.status(400).send('Invalid Request');
        }

        const result = await handleAuthorization({
            redirectUri: redirect_uri as string,
            state: state as string | undefined,
            auth_code: auth_code as string,
        });

        res.redirect(result.redirectUrl);
    } catch (err: any) {
        res.status(400).send(err.message);
    }
};

export const token = async (req: Request, res: Response) => {
    try {
        const { grant_type, code, refresh_token, client_id, client_secret } =
            req.body;

        // Validate client_id and client_secret
        if (
            client_id !== process.env.CLIENT_ID ||
            client_secret !== process.env.CLIENT_SECRET
        ) {
            return res.status(401).json({ error: 'invalid_client' });
        }

        const result = await handleToken({
            grantType: grant_type as string,
            code,
            refreshToken: refresh_token,
        });

        // Return the result (either new access token or error)
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const me = async (req: Request, res: Response) => {
    // res.json({
    //     shopId: 'Test',
    // });

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({ error: 'missing_authorization' });

        const shop = await handleMe(authHeader);

        res.json(shop);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};
