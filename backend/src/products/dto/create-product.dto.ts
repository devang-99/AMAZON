/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  category: string;

  @IsString()
  brand: string;

  @IsNumber()
  stock: number;

  @IsNumber()
  sellerId:number;
}
