import {NextFunction, Request, Response, Router} from 'express';
import {authService} from './auth.service';
import {currentUser, BadRequestError} from '@shop-app-package/common';

const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body;
  const result = await authService.signup({email, password});

  if(result.message) {
    return next(new BadRequestError(result.message))  
  };

  req.session = {jwt: result.jwt};

  res.status(201).json({success: true});
});

router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body;
  const result = await authService.signin({email, password});

  if(result.message) {
    return next(new BadRequestError(result.message))
  };

  req.session = {jwt: result.jwt};

  res.status(201).json({success: true});
});

router.get('/current-user', currentUser(process.env.JWT_KEY!), async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send(req.currentUser);
});

export {router as authRouters}