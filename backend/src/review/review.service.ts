import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model/review.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(ReviewModel.name) private readonly reviewModel: Model<ReviewModel>) {}

  async create(dto: CreateReviewDto) {
    return this.reviewModel.create(dto);
  }
  async findById(id: string) {
    return this.reviewModel.findById(id).exec();
  }
  async delete(id: string) {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async update(reviewId: string, updatedReviewData: UpdateReviewDto) {
    return await this.reviewModel.findByIdAndUpdate(reviewId, updatedReviewData, { new: true }).exec();
  }

  async findByProductId(productId: string) {
    return this.reviewModel.find({ productId: productId }).exec();
  }

  async deleteByProductId(productId: string) {
    return this.reviewModel.deleteMany({ productId: productId }).exec();
  }

  async findAllReviewsByProductId(productId: string) {
    return this.reviewModel.find({ productId: productId }).exec();
  }

  async updateImage(reviewId: string, index: number, imagePath: string) {
    return this.reviewModel
      .findByIdAndUpdate(reviewId, { $push: { images: { $each: [imagePath], $position: index } } }, { new: true })
      .exec();
  }

  async deleteImage(reviewId: string, index: number) {
    return this.reviewModel.findByIdAndUpdate(reviewId, { $unset: { [`images.${index}`]: '' } }, { new: true }).exec();
  }
}
