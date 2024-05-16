import { IsNotEmpty, IsString, IsNumber, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class AdvantagesDto {
  @IsNotEmpty()
  @IsString()
  header: string;

  @IsNotEmpty()
  @IsNumber()
  svgType: number;
}

export class AdvantagesHeadersDto {
  @IsNotEmpty()
  @IsString()
  header: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AdvantagesDto)
  advantages: AdvantagesDto[];
}

export class ProductDto {
  @IsNotEmpty()
  images: string[];

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  address: number[] | string;

  @IsNotEmpty()
  @IsNumber()
  calculatedRating: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AdvantagesHeadersDto)
  advantagesHeaders: AdvantagesHeadersDto[] | string;

  @IsNotEmpty()
  categories: string[];
  @IsNotEmpty()
  @IsString()
  userId: string;
}
