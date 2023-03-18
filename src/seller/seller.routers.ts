import {NextFunction, Request, Response, Router} from 'express';
import {BadRequestError, Uploader, UploaderMiddlewareOptions, requireAuth, CustomError} from '@shop-app-package/common';
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

router.post('/product/:id/update',requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;
  const {title, price} = req.body;

  const result = await sellerService.updateProduct({title, price, userId: req.currentUser!.userId, productId: id});

  if (result instanceof CustomError) {
    return next(result);
  };

  res.status(200).send(result);
});

router.delete('/product/:id/delete',requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;

  const result = await sellerService.deleteProduct({userId: req.currentUser!.userId, productId: id});
  if (result instanceof CustomError) {
    return next(result);
  };

  res.status(200).send(true);
});

router.post('/product/:id/add-images',requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;

  const result = await sellerService.addProductImages({userId: req.currentUser!.userId, productId: id, files: req.files});
  if (result instanceof CustomError) {
    return next(result);
  };
  res.status(200).send(result);
})

export {router as sellerRouters}