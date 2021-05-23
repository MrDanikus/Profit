import {Request, Response, NextFunction} from 'express';

import {Validator} from '../../helpers/validator';

import {Files} from '../../models/file';

import ServerError from '../../utils/errors/server-error';

export class FileController {
  static async getFile(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.params;
      Validator.isObjectId(id);

      const file = await Files.findById(id);

      if (!file) {
        throw new ServerError(404, 'File not found', 'Wrong id');
      }

      res.contentType(file.contentType).send(file.data);
    } catch (err) {
      return next(err);
    }
  }

  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new ServerError(422, 'No files was provided', 'Check form data');
      }

      const file = await Files.build({
        contentType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      }).save();

      res.json({
        type: 'file',
        data: {
          ...file.toJSON(),
          data: null,
        },
        link: `/v1/files/${file._id}`,
      });
    } catch (err) {
      return next(err);
    }
  }
}
