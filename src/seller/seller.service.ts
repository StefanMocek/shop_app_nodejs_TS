import {CreateProductDto} from "./dtos/product.dto";
import {ProductService, productService} from "./product/product.service";

export class SellerService {
  constructor (
    public productService: ProductService
  ) {};

  async addProduct (createProduct: CreateProductDto) {
    return await this.productService.create(createProduct)
  }
};

export const sellerService = new SellerService(productService) 