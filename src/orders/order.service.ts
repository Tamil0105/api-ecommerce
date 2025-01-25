import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { OrderedProduct } from 'src/entities/ordered-product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderedProduct)
    private readonly orderProductRepository: Repository<Order>,
  ) {}

  async create(
    orderData: Partial<Order>,
    productIds: number[],
  ): Promise<Order> {
    // Create the order
    const order = this.orderRepository.create(orderData);

    // Save the order first to get the generated ID
    const savedOrder = await this.orderRepository.save(order);

    // Create OrderedProduct entries
    const orderedProducts = productIds.map((productId) => {
      const orderedProduct = new OrderedProduct();
      orderedProduct.product = { id: productId } as Product;
      orderedProduct.order = savedOrder;
      return orderedProduct;
    });

    // Save the ordered products
    await this.orderProductRepository.save(orderedProducts);

    // Return the saved order with its ordered products
    return savedOrder;
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['orderedProducts', 'orderedProducts.product'],
    });
  }

  findOne(id: number): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['orderedProducts', 'orderedProducts.product'],
    });
  }

  async update(
    id: number,
    orderData: Partial<Order>,
    productIds: number[],
  ): Promise<Order> {

    // Find the existing order
    const existingOrder = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderedProducts'],
    });
    if (!existingOrder) {
      throw new Error('Order not found');
    }

    // Update the order properties
    Object.assign(existingOrder, orderData);
    await this.orderRepository.save(existingOrder);
    // First, delete existing ordered products that are not in the new productIds
    const existingProductIds = existingOrder.orderedProducts.map(
      (op) => op.id,
    );
    const productsToRemove = existingOrder.orderedProducts.filter(
      (op) => !productIds.includes(op.id),
    );
    if (productsToRemove.length > 0) {
      await this.orderProductRepository.delete(
        productsToRemove.map((op) => op.id),
      );
    }

    // Add new ordered products
    const newProductIds = productIds.filter(
      (productId) => !existingProductIds.includes(productId),
    );
    const orderedProducts = newProductIds.map((productId) => {
      const orderedProduct = new OrderedProduct();
      orderedProduct.product = { id: productId } as Product;
      orderedProduct.order = existingOrder;
      return orderedProduct;
    });

    // Save the new ordered products
    if (orderedProducts.length > 0) {
      await this.orderProductRepository.save(orderedProducts);
    }

    // Return the updated order with its ordered products
    return this.orderRepository.findOne({
      where: { id },
      relations: ['orderedProducts', 'orderedProducts.product'],
    });
  }

  async remove(id: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderedProducts'],
    });

    if (order) {
      await this.orderProductRepository.delete(
        order.orderedProducts.map((op) => op.id),
      );
    }

    return this.orderRepository.delete(id);
  }
}
