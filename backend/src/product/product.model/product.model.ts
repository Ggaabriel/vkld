import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Advantages {
  @prop()
  header: string;
  @prop()
  svgType: number;
}

class AdvantagesHeaders {
  @prop()
  header: string;
  @prop({ type: () => [Advantages] })
  advantages: Advantages[];
}
export interface ProductModel extends Base {}
export class ProductModel extends TimeStamps {
  @prop({ type: () => [String] })
  images: string[];
  @prop()
  title: string;
  @prop()
  address: string;
  @prop()
  description: string;
  @prop()
  calculatedRating: number;
  @prop({ type: () => [AdvantagesHeaders] })
  advantagesHeaders: AdvantagesHeaders[];
  categories: string[];
}
