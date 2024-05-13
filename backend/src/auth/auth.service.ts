import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthModel } from './auth.model/auth.model';
import { Model } from 'mongoose';
import { AuthDto, AuthUserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ProductModel } from 'src/product/product.model/product.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthModel.name) private authModel: Model<AuthModel>,
    @InjectModel(ProductModel.name) private productModel: Model<ProductModel>,
  ) {}
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Количество раундов соли для увеличения безопасности хэширования
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  createUser(AuthDto: AuthModel) {
    const newUser = new this.authModel(AuthDto);
    return newUser.save();
  }

  async findUserByLogin(login: string) {
    return await this.authModel.findOne({ login }).exec();
  }
  async updateUser(userId: string, updatedUserData) {
    return await this.authModel.findOneAndUpdate({ _id: userId }, updatedUserData, { new: true }).exec();
  }

  async findUserById(userId: string) {
    return await this.authModel.findById(userId).exec();
  }
  async deleteUserById(userId: string) {
    await this.productModel.deleteMany({ userId: userId }).exec();
    return await this.authModel.deleteOne({ _id: userId }).exec();
  }
}
