import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class ReviewModel {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  review: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ required: true })
  productId: Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
