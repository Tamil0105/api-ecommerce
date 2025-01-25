import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { Order } from 'src/entities/order.entity';
import { OrdersService } from './order.service';
import { OrderedProduct } from 'src/entities/ordered-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order,OrderedProduct])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
