/* eslint-disable prettier/prettier */
import { Products } from "src/products/entities/products.entity";
import {
    Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn,
    OneToMany,
} from "typeorm";

@Entity("users")
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: 'false' })
    isBanned: boolean;

    @Column()
    role: string;

    @OneToMany(() => Products, (product) => product.seller)
    products: Products[];

}