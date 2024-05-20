import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductModel, ProductModelSchema } from './product.model/product.model';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModel, ReviewSchema } from 'src/review/review.model/review.model';

@Module({
  controllers: [ProductController],
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductModel.name,
        schema: ProductModelSchema,
      },
      {
        name: ReviewModel.name,
        schema: ReviewSchema,
      },
    ]),
  ],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
