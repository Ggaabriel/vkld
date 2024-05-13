import {
  Controller,
  Post,
  Patch,
  Param,
  Headers,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Body,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductModel } from './product.model/product.model';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as fs from 'fs';
import { ProductDto } from './dto/find-product.dto';

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

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('image', 5, {
      storage,
      fileFilter,
      limits: {
        fileSize: 1024 * 1024, // 1 MB
      },
    }),
  )
  async createProduct(@Body() createProductDto: ProductDto, @UploadedFiles() images: Express.Multer.File[]) {
    try {
      // Создаем объект с данными нового продукта
      const newProductData: ProductDto = createProductDto;
      console.log(createProductDto);

      // Если изображения были загружены, сохраняем их пути в данных нового продукта
      if (images && images.length > 0) {
        newProductData.images = images.map((image) => image.path);
      }

      // Создаем новый продукт в базе данных
      const newProduct = await this.productService.createProduct(newProductData);

      return newProduct;
    } catch (error) {
      throw new HttpException('Ошибка при создании продукта', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
  async updateProduct(
    @Param('id') productId: string,
    @Body() updateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
    @UploadedFile() image: Express.Multer.File,
    @Body('imageIndex') imageIndex: number,
  ) {
    try {
      // Получаем текущий продукт из базы данных
      const currentProduct = await this.productService.findProductById(productId);

      if (!currentProduct) {
        throw new HttpException('Продукт не найден', HttpStatus.NOT_FOUND);
      }

      // Создаем объект с обновленными данными продукта
      const updatedProductData: Partial<ProductModel> = {};

      // Перебираем все поля в DTO и добавляем их в объект с обновленными данными,
      // если они определены и не равны undefined
      for (const key in updateProductDto) {
        if (updateProductDto[key] !== undefined) {
          updatedProductData[key] = updateProductDto[key];
        }
      }

      // Если изображения были загружены, сохраняем пути к ним в обновленных данных продукта
      if (images && images.length > 0) {
        updatedProductData.images = images.map((image) => image.path);
      } else if (image) {
        // Если указан индекс изображения, заменяем конкретное изображение
        if (imageIndex !== undefined && imageIndex >= 0 && imageIndex < currentProduct.images.length) {
          currentProduct.images[imageIndex] = image.path;
          updatedProductData.images = currentProduct.images;
        } else {
          throw new HttpException('Недопустимый индекс изображения', HttpStatus.BAD_REQUEST);
        }
      }

      // Если изображение было загружено, удаляем старые изображения из хранилища
      if (images && currentProduct.images.length > 0) {
        currentProduct.images.forEach((oldImagePath) => {
          fs.unlinkSync(oldImagePath); // Удалить старое изображение
        });
      }

      // Обновляем продукт в базе данных
      const updatedProduct = await this.productService.updateProduct(productId, updatedProductData);

      return updatedProduct;
    } catch (error) {
      throw new HttpException('Ошибка при обновлении продукта', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') productId: string) {
    try {
      // Вызываем метод удаления продукта из сервиса продукта
      const currentProduct = await this.productService.findProductById(productId);
      await this.productService.deleteProduct(productId);

      if (currentProduct.images.length > 0) {
        currentProduct.images.forEach((imagePath) => {
          fs.unlinkSync(imagePath); // Удалить изображения продукта
        });
      }

      // Возвращаем успешный статус
      return { message: 'Продукт успешно удален' };
    } catch (error) {
      // Если возникает ошибка при удалении продукта, возвращаем соответствующий статус
      throw new HttpException('Ошибка при удалении продукта', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getProducts() {
    try {
      // Получаем список всех продуктов из базы данных
      const products = await this.productService.findAllProducts();

      // Возвращаем список всех продуктов
      return products;
    } catch (error) {
      // Если возникает ошибка при получении списка продуктов, возвращаем соответствующий статус
      throw new HttpException('Ошибка при получении списка продуктов', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getProduct(@Param('id') productId: string) {
    try {
      // Получаем продукт из базы данных по его идентификатору
      const product = await this.productService.findProductById(productId);

      if (!product) {
        throw new HttpException('Продукт не найден', HttpStatus.NOT_FOUND);
      }

      // Возвращаем найденный продукт
      return product;
    } catch (error) {
      // Если возникает ошибка при получении продукта, возвращаем соответствующий статус
      throw new HttpException('Ошибка при получении продукта', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
