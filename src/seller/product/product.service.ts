import fs from 'fs';
import path from 'path';
import {ProductModel, uploadDir} from "@shop-app-package/common";
import {CreateProductDto, DeleteProductDto, UpdateProductDto} from "../dtos/product.dto";
import {Product} from "./product.model";

export class ProductService {
  constructor (public productModel: ProductModel) {};

  async getOneById (productId: string) {
    return await this.productModel.findById(productId)
  }

  async create(createProductDto: CreateProductDto) {
    const images = this.generateProductImages(createProductDto.files)
    const product = new this.productModel({
      title: createProductDto.title,
      price: createProductDto.price,
      user: createProductDto.userId,
      images
    });
    return await product.save()
  };

  async updateProduct(updateProductDto: UpdateProductDto) {
    return await this.productModel.findOneAndUpdate(
      {_id: updateProductDto.productId},
      {$set: {title: updateProductDto.title, price: updateProductDto.price}},
      {new: true})
  };

  async deleteProduct(deleteProductDto: DeleteProductDto) {
    return await this.productModel.findOneAndRemove({_id: deleteProductDto.productId})
  }

  generateBase64Url(contentType: string, buffer: Buffer) {
    return `data:${contentType};base64,${buffer.toString('base64')}`
  }
 
  generateProductImages(files: CreateProductDto['files']): Array<{src: string}> {
    let images: Array<Express.Multer.File>;

    if(typeof files === 'object') {
      images = Object.values(files).flat()
    } else {
      images = files ? [...files] : []
    };

    return images.map((file: Express.Multer.File) => {
      let srcObj = {src: this.generateBase64Url(file.mimetype, fs.readFileSync(path.join(uploadDir + file.filename)))};
      fs.unlink(path.join(uploadDir, file.filename), () => {});
      return srcObj;
    });
  }
};

export const productService = new ProductService(Product);