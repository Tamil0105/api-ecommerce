import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderedProduct } from './ordered-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  description: string;

  @OneToMany(() => OrderedProduct, (orderedProduct) => orderedProduct.product)
  orderedProducts: OrderedProduct[];
}
