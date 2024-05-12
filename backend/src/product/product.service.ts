import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model/product.model';

@Injectable()
export class ProductService {
  constructor(@InjectModel(ProductModel.name) private productModel: Model<ProductModel>) {}

  async createProduct(productDto: ProductDto) {
    const newProduct = new this.productModel(productDto);
    return await newProduct.save();
  }

  async findAllProducts() {
    return await this.productModel.find().exec();
  }

  async findProductById(productId: string) {
    return await this.productModel.findById(productId).exec();
  }

  async updateProduct(productId: string, updatedProductData: Partial<ProductDto>) {
    return await this.productModel.findByIdAndUpdate(productId, updatedProductData, { new: true }).exec();
  }

  async deleteProduct(productId: string) {
    return await this.productModel.findByIdAndDelete(productId).exec();
  }
}
