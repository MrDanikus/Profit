import express from 'express';
import multer from 'multer';

import {Authorization} from '../../../middleware/authorization';

import {FileController} from '../../../controllers/files';
import {ErrorController} from '../../../controllers/errors';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 2, // 2mb
    files: 1,
  },
});

const router = express.Router();

router
  .route('/')
  .post(
    Authorization.vendor().required(),
    upload.single('file'),
    FileController.uploadFile
  )
  .all(ErrorController.methodNotAllowed);

router
  .route('/:id')
  .get(FileController.getFile)
  .all(ErrorController.methodNotAllowed);

export default router;
