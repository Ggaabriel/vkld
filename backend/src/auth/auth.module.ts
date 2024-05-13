import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModel, AuthModelSchema } from './auth.model/auth.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ProductModel, ProductModelSchema } from 'src/product/product.model/product.model';

@Module({
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([
      {
        name: AuthModel.name,
        schema: AuthModelSchema,
      },
      {
        name: ProductModel.name,
        schema: ProductModelSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
      }),
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
