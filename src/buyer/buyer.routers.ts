import {NextFunction, Request, Response, Router} from 'express';
import {BadRequestError, requireAuth, CustomError} from '@shop-app-package/common';
import {buyerService} from './buyer.service';

const router = Router();

router.post('/cart/add',requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const {productId, quantity} = req.body;

  const result = await buyerService.addProductToCart({productId, quantity, userId: req.currentUser!.userId});

  if(result instanceof CustomError || result instanceof Error) {
    return next(result)
  };

  req.session = {...req.session, cartId: result._id};

  res.status(200).send(result)
});

router.post('/cart/product/:id/update-quantity', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const {amount} = req.body;
  const {id: productId} = req.params;
  const cartId = req.session?.cartId;
  if(!cartId) {
    return next(new BadRequestError('cartId is required'));
  }

  const inc = req.body.inc ==="true" ? true : req.body.inc ==="false" ? false : null;
  if (inc === null) {
    return next(new BadRequestError('inc should be either true or false'))
  };

  const result = await buyerService.uptadeCartproductQuantity({cartId, productId, options: {amount, inc}});

  if(result instanceof CustomError || result instanceof Error) {
    return next(result)
  };

  res.status(200).send(result);
});

router.post('/cart/delete/product', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const {productId} = req.body;
  const cartId = req.session?.cartId;
  if(!cartId) {
    return next(new BadRequestError('cartId is required'));
  }

  const result = await buyerService.removeProductFromCart({cartId, productId});
  if(result instanceof CustomError || result instanceof Error) {
    return next(result)
  };

  res.status(200).send(result);
});

router.post('/get/cart/:cartId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const cartId = req.session?.cartId;
  if(!cartId) {
    return next(new BadRequestError('cartId is required'));
  }
  const result = await buyerService.getCart(cartId, req.currentUser!.userId);
  if(result instanceof CustomError || result instanceof Error) {
    return next(result)
  };

  res.status(200).send(result);
})

export {router as buyerRouter}