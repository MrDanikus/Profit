import express from 'express';

const router = express.Router();

import adRouter from './ads';
import authRouter from './auth';
import vendorRouter from './vendors';

router.use('/ads', adRouter);
router.use('/auth', authRouter);
router.use('/vendors', vendorRouter);

export default router;
