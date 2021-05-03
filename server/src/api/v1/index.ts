import express from 'express';

const router = express.Router();

import adRouter from './ads';

router.use('/ads', adRouter);

export default router;
