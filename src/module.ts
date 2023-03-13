import * as dotenv from 'dotenv';
dotenv.config();

import express, {Application} from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';

export class AppModule {
  constructor (public app: Application) {
    app.set('trust proxy', true);
    app.use(cors({
      optionsSuccessStatus: 200
    }))
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(cookieSession({
      signed: false,
      secure: false
    }))
  };

  async start() {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL is require')
    };
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY is require')
    };
  
    try {
      await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
      throw new Error('database connection error')
    };

    this.app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  }
}