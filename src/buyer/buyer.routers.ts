import {NextFunction, Request, Response, Router} from 'express';
import {BadRequestError, Uploader, UploaderMiddlewareOptions, requireAuth, CustomError} from '@shop-app-package/common';
import {buyerService} from './buyer.service';
// import {sellerService} from './seller.service';

const router = Router();

router.post('/cart/add',requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const {productId, quantity} = req.body;

  const result = await buyerService.addProductToCart({productId, quantity, userId: req.currentUser!.userId});

  if(result instanceof CustomError || result instanceof Error) {
    return next(result)
  };

  res.status(200).send(result)
})

export {router as buyerRouter}