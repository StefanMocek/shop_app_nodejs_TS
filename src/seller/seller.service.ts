import {BadRequestError, NotAuthorizedError} from "@shop-app-package/common";
import {CreateProductDto, UpdateProductDto} from "./dtos/product.dto";
import {ProductService, productService} from "./product/product.service";

export class SellerService {
  constructor (
    public productService: ProductService
  ) {};

  async addProduct (createProduct: CreateProductDto) {
    return await this.productService.create(createProduct)
  }

  async updateProduct (updateProductDto: UpdateProductDto) {
    const product = await this.productService.getOneById(updateProductDto.productId);
    if(!product) {
      return new BadRequestError('Product dont found')
    };
    if(product.user.toString() !== updateProductDto.userId) {
      return new NotAuthorizedError()
    };

    return await this.productService.updateProduct(updateProductDto);
  }
};

export const sellerService = new SellerService(productService) 