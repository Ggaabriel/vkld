import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

class Advantages {
  @Prop({ required: true })
  header: string;
  @Prop({ required: true })
  svgType: number;
}

class AdvantagesHeaders {
  @Prop({ required: true })
  header: string;
  @Prop({ type: [Advantages] })
  advantages: Advantages[];
}
@Schema({ timestamps: true })
export class ProductModel {
  @Prop({ type: [String] })
  images: string[];
  @Prop({ required: true })
  title: string;
  @Prop({ type: [Number], required: true })
  address: number[];
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  calculatedRating: number;
  @Prop({ type: [AdvantagesHeaders] })
  advantagesHeaders: AdvantagesHeaders[];
  @Prop({ type: [String], required: true })
  categories: string[];
  @Prop({ required: true })
  userId: string;
}

export const ProductModelSchema = SchemaFactory.createForClass(ProductModel);
