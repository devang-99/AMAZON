/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "src/products/entities/products.entity";
import { Cart } from "./cart.entity";

@Entity("cart_items")
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, {
    onDelete: "CASCADE",
  })
  cart: Cart;

  @ManyToOne(() => Products, { eager: true })
  product: Products;

  @Column()
  quantity: number;
}
