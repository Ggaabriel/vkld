import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsString()
  review?: string;

  @IsOptional()
  @IsString()
  images?: string[];
}
