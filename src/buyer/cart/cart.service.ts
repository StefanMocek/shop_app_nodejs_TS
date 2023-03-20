import {CartModel, CartProductModel, ProductDoc} from "@shop-app-package/common";
import {AddProductToCartDto, CreateCartProductDto} from "../dtos/cart.dto";
import {CartProduct} from "./cart-product.model";
import {Cart} from "./cart.model";

export class CartService {
  constructor(
    public cartModel: CartModel,
    public cartProductModel: CartProductModel
  ) {}

  async findOneByUserId(userId: string){
    return await this.cartModel.findOne({user: userId})
  };

  async createCart(userId: string){
    const cart = new this.cartModel({
      user: userId
    });

    return await cart.save()
  };

  async createCartProduct(createCartProductDto: CreateCartProductDto){
    const cartProduct = new this.cartProductModel({
      cart: createCartProductDto.cartId,
      product: createCartProductDto.productId,
      quantity: createCartProductDto.quantity
    })

    return await cartProduct.save();
  };

  async isProductInCart(cartId: string, productId: string) {
    return !!(await this.cartProductModel.findOne({cartId, product: productId}))
  };

  async updateProductQuantity (cartId: string, productId: string, options: {inc: boolean, amount: number}){
    const {inc, amount} = options;
    const cartProduct = await this.cartProductModel.findOne({product: productId});
    if(!cartProduct) {
      return null
    };
    if(cartProduct.quantity < amount && !inc){

    };

    const updatedCartProduct = await this.cartProductModel.findOneAndUpdate(
      {_id: cartProduct._id},
      {$inc: {quantity: inc ? amount : -amount}},
      {new: true}
    ).populate('product');

    const newPrice = inc 
      ? updatedCartProduct!.product.price * amount
      : -(updatedCartProduct!.product.price * amount);

    const upadtedCart = await this.cartModel.findOneAndUpdate(
      {_id:cartId},
      {$inc: { totalPrice: newPrice }},
      {new: true}
    )
  }

  async addProduct(addProductToCartDto: AddProductToCartDto, product: ProductDoc) {
    const {userId, quantity, productId} = addProductToCartDto;
    let cart = await this.findOneByUserId(userId)

    const isProductInCart = cart && await this.isProductInCart(cart._id, productId);

    if(isProductInCart && cart){
      return this.updateProductQuantity(cart._id, productId, {inc: true, amount: quantity})
    }
    
    if(!cart) {
      cart = await this.createCart(userId)
    };

    const cartProduct = this.createCartProduct({
      cartId: cart._id,
      productId,
      quantity
    });

    return await this.cartModel.findOneAndUpdate(
      {_id: cart._id},
      {$push: {products: cartProduct}, $inc: {totalPrice: product.price * quantity}},
      {new: true}
    )
  }
}

export const cartService = new CartService(Cart, CartProduct)