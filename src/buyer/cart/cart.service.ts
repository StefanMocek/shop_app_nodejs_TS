import {CartModel, CartProductModel} from "@shop-app-package/common";
import {CartProduct} from "./cart-product.model";
import {Cart} from "./cart.model";

export class CartService {
  constructor(
    public cartModel: CartModel,
    public cartProductModel: CartProductModel
  ) {}

  async findOneByUserId(userId: string){
    return await this.cartModel.findOne({user: userId})
  }
}

export const cartService = new CartService(Cart, CartProduct)