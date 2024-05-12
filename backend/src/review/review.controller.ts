// import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
// import { ReviewModel } from './review.model/review.model';
// import { CreateReviewDto } from './dto/create-review.dto';
// import { ReviewService } from './review.service';

// @Controller('review')
// export class ReviewController {
//   constructor(private readonly reviewService: ReviewService) {}
//   @Post('create')
//   async create(@Body() dto: CreateReviewDto) {
//     return this.reviewService.create(dto);
//   }

//   @Delete(':id')
//   async delete(@Param('id') id: string) {
//     const deleteDoc = await this.reviewService.delete(id);
//     if (!deleteDoc) {
//       throw new HttpException('отзыв с таким id не найден', HttpStatus.NOT_FOUND);
//     }
//   }

//   @Get('byProduct/:id')
//   async byProduct(@Param('id') id: string) {
//     return this.reviewService.findByProductId(id);
//   }

//   @Patch(':id')
//   async patch(@Param('id') id: string, @Body() dto: ReviewModel) {}
// }
