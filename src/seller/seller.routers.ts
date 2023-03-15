import {NextFunction, Request, Response, Router} from 'express';

const router = Router();

router.post('/product/new', async (req: Request, res: Response, next: NextFunction) => {
  const {title, price} = req.body;
  
}) 

export {router as sellerRouters}