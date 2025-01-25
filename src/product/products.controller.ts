import { Controller, Get,} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'src/entities/product.entity';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

 
  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  
}
