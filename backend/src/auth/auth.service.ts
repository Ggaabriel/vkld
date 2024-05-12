import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthModel } from './auth.model/auth.model';
import { Model } from 'mongoose';
import { AuthDto, AuthUserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(AuthModel.name) private authModel: Model<AuthModel>) {}
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
    return await this.authModel.deleteOne({ _id: userId }).exec();
  }
}
