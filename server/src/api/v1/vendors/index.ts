import express from 'express';

import {VendorController} from '../../../controllers/vendors';
import {ErrorController} from '../../../controllers/errors';

const router = express.Router();

router
  .route('/')
  .get(VendorController.getAll)
  .all(ErrorController.methodNotAllowed);

export default router;
