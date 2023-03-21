import Stripe from 'stripe'
import {BadRequestError, NotAuthorizedError} from "@shop-app-package/common";
import {ProductService, productService} from "../seller/product/product.service";
import {CartService, cartService} from "./cart/cart.service";
import {
  AddProductToCartDto, 
  RemoveProductFromCartDto, 
  UpdateCartProductQuantityDto} from "./dtos/cart.dto";
import {OrderService, orderService} from "./order/order.service";

export class BuyerService {
  constructor(
    public cartService: CartService,
    public productService: ProductService,
    public orderService: OrderService,
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

    let customerId: string;
    if(cart.customerId) {
      customerId = cart.customerId
    } else {
      const {id} = await this.stripeService.customers.create({
        email: userEmail,
        source: cardToken
      });
      customerId = id;
      await cart.set({customerId}).save();
    };

    if(!customerId) {
      return new BadRequestError('Invalid data');
    };

    const charge = await this.stripeService.charges.create({
      amount: cart.totalPrice * 100,
      currency: 'pln',
      customer: customerId
    });

    if(!charge) {
      return new BadRequestError('Invalid data. Couldnt create a charge');
    };

    // create new order
    await this.orderService.createOrder({
      userId,
      totalAmount: cart.totalPrice,
      chargeId: charge.id
    })

    // clear cart
    await this.cartService.clearCart(userId, cart._id)

    return charge;
  }
};

export const buyerService = new BuyerService(
  cartService, 
  productService,
  orderService,
  new Stripe(process.env.STRIPE_KEY!, {apiVersion: '2022-11-15'})
);