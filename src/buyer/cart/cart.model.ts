import mongoose from 'mongoose';
import {CartDoc, CartModel} from '@shop-app-package/common';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartProduct"
    }
  ],
  totalPrice: {
    type: Number,
    default: 0,
    required: true
  },
  customerId:{
    type:String
  }
});

export const Cart = mongoose.model<CartDoc, CartModel>('Cart', cartSchema);