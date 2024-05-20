import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewModel, ReviewSchema } from './review.model/review.model';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModel, ProductModelSchema } from 'src/product/product.model/product.model';

@Module({
  controllers: [ReviewController],
  imports: [
    MongooseModule.forFeature([
      {
        name: ReviewModel.name,
        schema: ReviewSchema,
      },
      {
        name: ProductModel.name,
        schema: ProductModelSchema,
      },
    ]),
  ],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
