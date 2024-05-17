import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  HttpException,
  HttpStatus,
  Patch,
  Param,
  Headers,
  Delete,
  Get,
} from '@nestjs/common';
import { AuthDto, AuthUserDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multer = require('multer');
import * as fs from 'fs';
import { JwtService } from '@nestjs/jwt';
import { AuthModel } from './auth.model/auth.model';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'images');
  },
  filename(req, file, cb) {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`);
  },
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Invalid file type'), false);
  }
};

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
      limits: {
        fileSize: 1024 * 1024, // 1 MB
      },
    }),
  )
  @UsePipes(new ValidationPipe())
  async register(@Body() authDto: AuthDto, @UploadedFile() image: Express.Multer.File) {
    try {
      const { login, password, name } = authDto;
      const user = await this.authService.createUser({
        login,
        passwordHash: await this.authService.hashPassword(password),
        name,
        image: image !== undefined ? image.path : '',
      });
      const token = this.jwtService.sign({ _id: user._id });

      return { token };
    } catch (error) {
      if (image && fs.existsSync(image.path)) {
        fs.unlinkSync(image.path);
      }
      throw new HttpException('Пользователь с данным логином уже существует!', HttpStatus.UNAUTHORIZED);
    }
  }

  @HttpCode(200)
  @Post('login')
  async authUser(@Body() body: AuthUserDto) {
    const { login, password } = body;

    const user = await this.authService.findUserByLogin(login);

    if (!user) {
      throw new HttpException('Пользователь с таким логином не найден', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatched = await this.authService.comparePasswords(password, user.passwordHash);

    if (!isPasswordMatched) {
      throw new HttpException('Неверный пароль', HttpStatus.UNAUTHORIZED);
    }

    const token = this.jwtService.sign({ _id: user._id });

    return { token };
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
      limits: {
        fileSize: 1024 * 1024, // 1 MB
      },
    }),
  )
  async updateUser(@Param('id') userId: string, @Body() updateUserDto, @UploadedFile() image: Express.Multer.File) {
    try {
      // Получаем текущего пользователя из базы данных
      const currentUser = await this.authService.findUserById(userId);

      if (!currentUser) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      // Создаем объект с обновленными данными пользователя
      const updatedUserData: Partial<AuthModel> = {};

      // Перебираем все поля в DTO и добавляем их в объект с обновленными данными,
      // если они определены и не равны undefined
      for (const key in updateUserDto) {
        if (updateUserDto[key] !== undefined) {
          updatedUserData[key] = updateUserDto[key];
        }
      }

      // Если изображение было загружено, сохраняем путь к нему в обновленных данных пользователя
      // Если новое изображение было загружено, удаляем старое изображение из хранилища
      if (image && currentUser.image) {
        fs.unlinkSync(currentUser.image); // Удалить старое изображение
      }
      if (image) {
        updatedUserData.image = image.path;
      }

      // Обновляем пользователя в базе данных
      const updatedUser = await this.authService.updateUser(userId, updatedUserData);

      return updatedUser;
    } catch (error) {
      throw new HttpException('Ошибка при обновлении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Delete()
  async deleteUser(@Headers('token') token: string) {
    try {
      // Расшифровываем токен, чтобы получить идентификатор пользователя
      const decodedToken: any = this.jwtService.verify(token);

      // Получаем идентификатор пользователя из токена
      const userId = decodedToken._id;

      // Вызываем метод удаления пользователя из сервиса аутентификации
      const currentUser = await this.authService.findUserById(userId);
      await this.authService.deleteUserById(userId);
      console.log(userId);
      if (currentUser.image) {
        fs.unlinkSync(currentUser.image); // Удалить старое изображение
      }

      // Возвращаем успешный статус
      return { message: 'Пользователь успешно удален' };
    } catch (error) {
      // Если возникает ошибка при удалении пользователя, возвращаем соответствующий статус
      throw new HttpException('Ошибка при удалении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get()
  async getUser(@Headers('token') token: string) {
    try {
      // Расшифровываем токен, чтобы получить идентификатор пользователя
      const decodedToken: any = this.jwtService.verify(token); // Замените 'your_secret_key' на ваш секретный ключ

      // Получаем идентификатор пользователя из токена
      const userId = decodedToken._id;

      // Вызываем метод для получения пользователя из базы данных по его идентификатору
      const user = await this.authService.findUserById(userId);

      if (!user) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      // Возвращаем найденного пользователя
      return user;
    } catch (error) {
      // Если возникает ошибка при получении пользователя, возвращаем соответствующий статус
      throw new HttpException('Ошибка при получении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    try {
      // Вызываем метод для получения пользователя из базы данных по его идентификатору
      const user = await this.authService.findUserById(userId);

      if (!user) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      // Возвращаем найденного пользователя
      return user;
    } catch (error) {
      // Если возникает ошибка при получении пользователя, возвращаем соответствующий статус
      throw new HttpException('Ошибка при получении пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
