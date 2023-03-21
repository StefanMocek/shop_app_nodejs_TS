import {BadRequestError} from "@shop-app-package/common";
import {ProductService, productService} from "../seller/product/product.service";
import {CartService, cartService} from "./cart/cart.service";
import {AddProductToCartDto, UpdateCartProductQuantityDto} from "./dtos/cart.dto";

export class BuyerService {
  constructor(
    public cartService: CartService,
    public productService: ProductService 
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
      return new BadRequestError('Product not found in cart')  ;   
    };

    const cart =  await this.cartService.updateProductQuantity(updateCartProductQuantityDto);
    if (!cart) {
      return new Error('Couldnt add product to cart');
    };

    return cart;
  }
}

export const buyerService = new BuyerService(cartService, productService)