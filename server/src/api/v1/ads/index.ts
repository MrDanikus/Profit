import express from 'express';

import {Authorization} from '../../../middleware/authorization';
import {BodyParser, QueryParser} from '../../../middleware/parsers';
import {RequestSanitizer} from '../../../middleware/sanitizer';

import {AdController} from '../../../controllers/ads';
import {CommentController} from '../../../controllers/comments';
import {ErrorController} from '../../../controllers/errors';

const router = express.Router();

router
  .route('/')
  .get(new QueryParser(), new RequestSanitizer(), AdController.getAll)
  .post(
    Authorization.vendor().required(),
    new BodyParser(),
    new RequestSanitizer(),
    AdController.postAd
  )
  .all(ErrorController.methodNotAllowed);

router
  .route('/:adId')
  .get(new QueryParser(), new RequestSanitizer(), AdController.getById)
  .patch(
    Authorization.vendor().required(),
    new BodyParser(),
    new RequestSanitizer(),
    AdController.patchById
  )
  .delete(
    Authorization.vendor().required(),
    new RequestSanitizer(),
    AdController.deleteById
  )
  .all(ErrorController.methodNotAllowed);

router
  .route('/:adId/comments')
  .get(new QueryParser(), new RequestSanitizer(), CommentController.getAll)
  .post(
    Authorization.vendor().client().admin().required(),
    new BodyParser(),
    new RequestSanitizer(),
    CommentController.postComment
  )
  .all(ErrorController.methodNotAllowed);

router
  .route('/:adId/comments/:id')
  .get(new QueryParser(), new RequestSanitizer(), CommentController.getById)
  .all(ErrorController.methodNotAllowed);

export default router;
