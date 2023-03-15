import mongoose from 'mongoose';
import {ProductDoc, ProductModel} from '@shop-app-package/common';

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [
    {
      src: {
        type: String,
        required: true
      }
    }
  ]
});

export const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema);
