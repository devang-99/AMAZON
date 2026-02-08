/* eslint-disable prettier/prettier */
import { Users } from "src/users/entities/user.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";


@Entity("products")
export class Products {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    description: string;

    @Column({
        type: "decimal",
        precision: 10,
    })
    price: number;

    @Column()
    category: string;

    @Column()
    brand: string;

    @Column()
    stock: number;

    @Column("text", {
        array: true,
        default: () => "ARRAY[]::text[]",
    })
    images: string[];

    @ManyToOne(() => Users, (user) => user.products, {
        nullable: false,
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "sellerId" })
    seller: Users;
}
