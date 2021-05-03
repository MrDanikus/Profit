import express from 'express';

import {Authorization} from '../../../middleware/authorization';
import {parseBody, parseQuery} from '../../../middleware/parsers';
import {sanitizeRequest} from '../../../middleware/sanitizer';

import {AdController} from '../../../controllers/ads';
import {CommentController} from '../../../controllers/comments';
import {ErrorController} from '../../../controllers/errors';

const router = express.Router();

router
  .route('/')
  .get(parseQuery(), sanitizeRequest, AdController.getAll)
  .post(
    Authorization.vendor().required().middleware,
    parseBody(),
    sanitizeRequest,
    AdController.postAd
  )
  .all(ErrorController.methodNotAllowed);

router
  .route('/:adId')
  .get(parseQuery(), sanitizeRequest, AdController.getById)
  .patch(
    Authorization.vendor().required().middleware,
    parseBody(),
    sanitizeRequest,
    AdController.patchById
  )
  .delete(
    Authorization.vendor().required().middleware,
    sanitizeRequest,
    AdController.deleteById
  )
  .all(ErrorController.methodNotAllowed);

router
  .route('/:adId/comments')
  .get(parseQuery(), sanitizeRequest, CommentController.getAll)
  .post(
    Authorization.vendor().client().admin().required().middleware,
    parseBody(),
    sanitizeRequest,
    CommentController.postComment
  )
  .all(ErrorController.methodNotAllowed);

router
  .route('/:adId/comments/:id')
  .get(parseQuery(), sanitizeRequest, CommentController.getById)
  .all(ErrorController.methodNotAllowed);

export default router;
