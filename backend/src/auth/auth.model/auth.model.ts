import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class AuthModel {
  @Prop({ unique: true, required: true })
  login: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: false })
  image?: string;
}

export const AuthModelSchema = SchemaFactory.createForClass(AuthModel);
