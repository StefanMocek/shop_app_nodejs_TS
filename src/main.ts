import { AppModule } from "./module";
import express from "express";
import {JwtPayload} from '@shop-app-package/common'

declare global {
  namespace Express {
    interface Request {
      currentUser?: JwtPayload;
      uploaderError?: Error
    }
  }
}

const boostrap = () => {
  const app = new AppModule(express());

  app.start();
};

boostrap();