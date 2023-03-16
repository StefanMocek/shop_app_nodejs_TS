import {NextFunction, Request, Response, Router} from 'express';
import {BadRequestError, Uploader, UploaderMiddlewareOptions, requireAuth} from '@shop-app-package/common';
import {sellerService} from './seller.service';

const router = Router();

const uploader = new Uploader();
const middlewareOptions: UploaderMiddlewareOptions = {
  types: ['image/png', 'image/jpeg'],
  fieldName: 'image'
};

const multipleFilesMiddleware = uploader.uploadMultipleFiles(middlewareOptions);

router.post('/product/new',requireAuth, multipleFilesMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const {title, price} = req.body;

  if (!req.files) {
    return next(new BadRequestError('images are required'))
  }

  if (req.uploaderError) {
    return next(new BadRequestError(req.uploaderError.message));
  };

  const product = await sellerService.addProduct({
    title, 
    price, 
    userId: req.currentUser!.userId, 
    files: req.files
  });

  res.status(201).send(product);
});

router.post('/product/:id/update')

export {router as sellerRouters}