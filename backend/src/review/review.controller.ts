import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewModel } from './review.model/review.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { UpdateReviewDto } from './dto/update-review.dto';

import { FilesInterceptor } from '@nestjs/platform-express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';

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
    cb(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
  }
};

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseInterceptors(
    FilesInterceptor('image', 5, {
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
  )
  @Post('create')
  async create(@Body() dto: CreateReviewDto, @UploadedFiles() images: Express.Multer.File[]) {
    console.log(dto);
    try {
      const newReviewData: CreateReviewDto = dto;

      if (images && images.length > 0) {
        newReviewData.images = images.map((image) => image.path);
      }

      return this.reviewService.create(newReviewData);
    } catch (error) {
      throw new HttpException(`Ошибка при создании комментария: ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('byProduct/:id')
  async byProduct(@Param('id') id: string) {
    return this.reviewService.findByProductId(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleteDoc = await this.reviewService.delete(id);
    if (!deleteDoc) {
      throw new HttpException('отзыв с таким id не найден', HttpStatus.NOT_FOUND);
    }
  }

  @UseInterceptors(
    FileInterceptor('image', {
      storage,
      fileFilter,
    }),
  )
  @Patch(':id/image/:index')
  async updateImage(
    @Param('id') id: string,
    @Param('index') index: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      // Если изображение было загружено, удаляем старые изображения из хранилища
      const currentReview = await this.reviewService.findById(id);
      if (image && currentReview.images.length > 0) {
        currentReview.images.forEach((oldImagePath) => {
          fs.unlinkSync(oldImagePath); // Удалить старое изображение
        });
      }
      await this.reviewService.updateImage(id, index, image.path);
      return { message: 'Изображение обновлено' };
    } catch (error) {
      throw new HttpException('Ошибка обновления изображения', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id/image/:index')
  async deleteImage(@Param('id') id: string, @Param('index') index: number) {
    try {
      const currentReview = await this.reviewService.findById(id);
      currentReview.images.forEach((oldImagePath) => {
        fs.unlinkSync(oldImagePath); // Удалить старое изображение
      });
      await this.reviewService.deleteImage(id, index);
      return { message: 'Изображение удалено' };
    } catch (error) {
      throw new HttpException('Ошибка удаления изображения', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    try {
      await this.reviewService.update(id, dto);
      return { message: 'Комментарий обновлен' };
    } catch (error) {
      throw new HttpException('Ошибка обновления комментария', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
