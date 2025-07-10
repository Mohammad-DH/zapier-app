import { Router } from 'express';
import {
    authorize,
    token,
    me,
    subscribe,
    list,
    unsubscribe,
} from '../controller';

const router = Router();

router.get('/authorize', async (req, res) => {
    await authorize(req, res);
});

router.post('/token', async (req, res) => {
    await token(req, res);
});

router.get('/me', async (req, res) => {
    await me(req, res);
});

router.post('/subscribe', async (req, res) => {
    await subscribe(req, res);
});

router.post('/unsubscribe', async (req, res) => {
    await unsubscribe(req, res);
});

router.get('/list', async (req, res) => {
    await list(req, res);
});

export default router;
