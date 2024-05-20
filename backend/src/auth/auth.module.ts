import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModel, AuthModelSchema } from './auth.model/auth.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from '../product/product.module'; // Импортируйте ProductModule
import { ReviewModule } from 'src/review/review.module';

@Module({
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: AuthModel.name, schema: AuthModelSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
      }),
    }),
    ProductModule, // Добавьте ProductModule в imports
    ReviewModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
