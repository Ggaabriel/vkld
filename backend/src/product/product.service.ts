import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model/product.model';
import { ReviewModel } from 'src/review/review.model/review.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel.name) private productModel: Model<ProductModel>,
    @InjectModel(ReviewModel.name) private reviewModel: Model<ReviewModel>,
  ) {}

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
  async deleteAllByUserId(userId: string) {
    await this.productModel.deleteMany({ userId: userId }).exec();
  }
  async getProductsByCategory(category: string) {
    return await this.productModel
      .find({
        categories: { $in: [category] }, // Ищем модели, у которых в массиве categories есть заданная категория
      })
      .exec();
  }
  async getAllProductsByUserId(userId: string) {
    return await this.productModel.find({ userId: userId }).exec();
  }
  async searchProducts(title: string): Promise<ProductModel[]> {
    // Используйте Mongoose для выполнения запроса поиска
    return await this.productModel.find({ title: { $regex: title, $options: 'i' } }).exec();
  }
}
