import {BadRequestError, NotAuthorizedError} from "@shop-app-package/common";
import {ProductService, productService} from "../seller/product/product.service";
import {CartService, cartService} from "./cart/cart.service";
import {
  AddProductToCartDto, 
  RemoveProductFromCartDto, 
  UpdateCartProductQuantityDto} from "./dtos/cart.dto";
import Stripe from 'stripe'

export class BuyerService {
  constructor(
    public cartService: CartService,
    public productService: ProductService,
    public stripeService: Stripe
  ){}

  async addProductToCart(addProductToCartDto: AddProductToCartDto){
    const product = await this.productService.getOneById(addProductToCartDto.productId);
    if(!product){
      return new BadRequestError('Product not found')
    };

    const cart = await this.cartService.addProduct(addProductToCartDto, product);
    if (!cart) {
      return new Error('Couldnt add product to cart');
    };

    return cart;
  };

  async uptadeCartproductQuantity(updateCartProductQuantityDto: UpdateCartProductQuantityDto){
    const {productId, cartId} = updateCartProductQuantityDto;
    const cartProduct = await this.cartService.getCartProductById(productId, cartId);
    if(!cartProduct) {
      return new BadRequestError('Product not found in cart');   
    };

    const cart =  await this.cartService.updateProductQuantity(updateCartProductQuantityDto);
    if (!cart) {
      return new Error('Couldnt add product to cart');
    };

    return cart;
  };

  async removeProductFromCart(removeProductFromCartDto: RemoveProductFromCartDto){
    const {cartId, productId} = removeProductFromCartDto;
    const cartProduct = await this.cartService.getCartProductById(productId, cartId);
    if(!cartProduct) {
      return new BadRequestError('Product not found in cart');   
    };

    const cart = await this.cartService.removeProductFromCart(removeProductFromCartDto);
    if (!cart) {
      return new Error('Couldnt remove product from cart');
    };

    return cart;
  };

  async getCart(cartId: string, userId: string){
    const cart = await this.cartService.getCart(cartId);
    if (!cart) {
      return new BadRequestError('Cart not found');
    };

    if (cart.user.toString() !== userId){
      return new NotAuthorizedError()
    };

    return cart;
  };

  async checkOut(userId: string, cardToken: string, userEmail: string){
    const cart = await this.cartService.findOneByUserId(userId);
    if(!cart || cart.products.length === 0) {
      return new BadRequestError('Your cart is empty');
    };

    const {id} = await this.stripeService.customers.create({
      email: userEmail,
      source: cardToken
    });
    if(!id) {
      return new BadRequestError('Invalid data');
    };

    const charge = await this.stripeService.charges.create({
      amount: cart.totalPrice * 100,
      currency: 'pln',
      customer: id
    });

    if(!charge) {
      return new BadRequestError('Invalid data. Couldnt create a charge');
    };

    // create new order

    // clear cart

    return charge;
  }
};

export const buyerService = new BuyerService(
  cartService, 
  productService,
  new Stripe(process.env.STRIPE_KEY!, {apiVersion: '2022-11-15'})
);