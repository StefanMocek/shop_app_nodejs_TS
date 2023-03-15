import {NextFunction, Request, Response, Router} from 'express';
import { BadRequestError, Uploader, UploaderMiddlewareOptions } from '@shop-app-package/common';

const router = Router();

const uploader = new Uploader();
const middlewareOptions: UploaderMiddlewareOptions = {
  types: ['image/png', 'image/jpeg'],
  fieldName: 'image'
};

const multipleFilesMiddleware = uploader.uploadMultipleFiles(middlewareOptions);

router.post('/product/new',multipleFilesMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const {title, price} = req.body;

  if(!req.files) {
    return next(new BadRequestError('images are required'))
  }
  
  if(req.uploaderError) {
    return next(new BadRequestError(req.uploaderError.message));
  };

  
}) 

export {router as sellerRouters}