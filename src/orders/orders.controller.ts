import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { Order } from 'src/entities/order.entity';
import { OrdersService } from './order.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: { orderData: Partial<Order>; productIds: number[] }): Promise<Order> {
    return this.ordersService.create(createOrderDto.orderData, createOrderDto.productIds);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() orderData: Partial<Order>,
    @Body('productIds') productIds: number[],
  ): Promise<Order> {
    return this.ordersService.update(id, orderData, productIds);
  }
  
  @Delete(':id')
  async delete(@Param('id') id: number ) {
    return this.ordersService.remove(id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }
}