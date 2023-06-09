import * as dotenv from 'dotenv';
dotenv.config();

import express, {Application} from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import {errorHandler, currentUser} from '@shop-app-package/common';
import {authRouters} from './auth/auth.routers';
import {sellerRouters} from './seller/seller.routers';
import {buyerRouter} from './buyer/buyer.routers';

const PORT = process.env.PORT || 3000

export class AppModule {
  constructor (public app: Application) {
    app.set('trust proxy', true);
    app.use(cors({
      credentials: true,
      optionsSuccessStatus: 200
    }))
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(cookieSession({
      signed: false,
      secure: false
    }));

    Object.setPrototypeOf(this, AppModule.prototype);
  };

  async start() {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL is require')
    };
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY is require')
    };
    if (!process.env.STRIPE_KEY) {
      throw new Error('STRIPE_KEY is require')
    };
  
    try {
      await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
      throw new Error('database connection error')
    };

    this.app.use(currentUser(process.env.JWT_KEY));
    this.app.use(authRouters);
    this.app.use(sellerRouters);
    this.app.use(buyerRouter);
    this.app.use(errorHandler);

    this.app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  }
}