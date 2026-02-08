/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

import { Products } from "./entities/products.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  ) {}

  /* -------------------- PRIVATE HELPERS -------------------- */

  private ensureSeller(role: string) {
    if (role.toUpperCase() !== "SELLER") {
      throw new BadRequestException("Only sellers are allowed");
    }
  }

  /* -------------------- CREATE PRODUCT -------------------- */

  async createProductBySeller(
    sellerId: number,
    role: string,
    dto: CreateProductDto,
    images: string[],
  ) {
    this.ensureSeller(role);

    const product = this.productRepository.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category.trim().toUpperCase(),
      brand: dto.brand.trim().toUpperCase(),
      stock: dto.stock,
      images,
      seller: { id: sellerId },
    });

    return this.productRepository.save(product);
  }

  /* -------------------- GET ALL PRODUCTS (PAGINATED) -------------------- */

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
      order: { id: "ASC" },
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  /* -------------------- GET PRODUCTS BY SELLER -------------------- */

  async getProductsBySeller(sellerId: number, role: string) {
    this.ensureSeller(role);

    return this.productRepository.find({
      where: { seller: { id: sellerId } },
      order: { id: "DESC" },
    });
  }

  /* -------------------- UPDATE PRODUCT (SELLER ONLY) -------------------- */

  async updateProductBySeller(
    productId: number,
    sellerId: number,
    role: string,
    dto: UpdateProductDto,
  ) {
    this.ensureSeller(role);

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ["seller"],
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (product.seller.id !== sellerId) {
      throw new BadRequestException(
        "You can update only your own products",
      );
    }

    Object.assign(product, {
      ...dto,
      category: dto.category
        ? dto.category.trim().toUpperCase()
        : product.category,
      brand: dto.brand
        ? dto.brand.trim().toUpperCase()
        : product.brand,
    });

    return this.productRepository.save(product);
  }

  /* -------------------- SEARCH PRODUCTS -------------------- */

  async searchProducts(searchTerm: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      where: [
        { name: ILike(`%${searchTerm}%`) },
        { description: ILike(`%${searchTerm}%`) },
      ],
      skip,
      take: limit,
      order: { id: "ASC" },
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }

  /* -------------------- GET SINGLE PRODUCT -------------------- */

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["seller"],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /* -------------------- GET PRODUCTS BY CATEGORY -------------------- */

  async findByCategory(category: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const normalizedCategory = category.trim().toUpperCase();

    const [data, total] = await this.productRepository.findAndCount({
      where: { category: normalizedCategory },
      skip,
      take: limit,
      order: { id: "ASC" },
    });

    return {
      data,
      page,
      limit,
      total,
    };
  }
}
