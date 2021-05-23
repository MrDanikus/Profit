import express from 'express';

const router = express.Router();

import adRouter from './ads';
import authRouter from './auth';
import vendorRouter from './vendors';
import fileRouter from './files';

router.use('/ads', adRouter);
router.use('/auth', authRouter);
router.use('/vendors', vendorRouter);
router.use('/files', fileRouter);

export default router;
