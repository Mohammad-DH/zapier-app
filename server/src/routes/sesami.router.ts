import { Router } from 'express';
import { triggerAction, getShop, refreshAuthCode } from '../controller';

const router = Router();

router.post('/triggerAction', async (req, res) => {
    await triggerAction(req, res);
});

router.post('/getShop', async (req, res) => {
    await getShop(req, res);
});

router.post('/refreshAuthCode', async (req, res) => {
    await refreshAuthCode(req, res);
});

export default router;
