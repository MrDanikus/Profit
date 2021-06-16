import express from 'express';

import {BodyParser} from '../../../middleware/parsers';
import {RequestSanitizer} from '../../../middleware/sanitizer';

import {AuthenticationController} from '../../../controllers/authentication';
import {ErrorController} from '../../../controllers/errors';

const router = express.Router();

router
  .route('/')
  .post(
    new BodyParser(),
    new RequestSanitizer(),
    AuthenticationController.postAuth
  )
  .all(ErrorController.methodNotAllowed);

export default router;
