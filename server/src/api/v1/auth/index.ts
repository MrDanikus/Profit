import express from 'express';

import {parseBody} from '../../../middleware/parsers';
import {sanitizeRequest} from '../../../middleware/sanitizer';

import {AuthenticationController} from '../../../controllers/authentication';
import {ErrorController} from '../../../controllers/errors';

const router = express.Router();

router
  .route('/')
  .post(parseBody(), sanitizeRequest, AuthenticationController.postAuth)
  .all(ErrorController.methodNotAllowed);

export default router;
