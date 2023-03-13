import { AppModule } from "./module";
import express from "express";

const boostrap = () => {
  const app = new AppModule(express());

  app.start();
};

boostrap();