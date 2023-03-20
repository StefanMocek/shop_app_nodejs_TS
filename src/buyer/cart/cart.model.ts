import mongoose from 'mongoose';
import {CartDoc, CartModel} from '@shop-app-package/common';

const cartSchema = new mongoose.Schema({
  user: {
    tyoe: mongoose.Schema.Types.ObjectId,
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
  }
});

export const Cart = mongoose.model<CartDoc, CartModel>('Cart', cartSchema);