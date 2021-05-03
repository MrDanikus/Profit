import express from 'express';

const router = express.Router();

import adRouter from './ads';
import authRouter from './auth';

router.use('/ads', adRouter);
router.use('/auth', authRouter);

export default router;
