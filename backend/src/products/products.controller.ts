/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  ParseIntPipe,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { multerOptions } from "../database/multerConfiguration/multerConfig";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ GET ALL PRODUCTS
  @Get("all")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.productsService.findAll(
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  // ✅ SEARCH PRODUCTS
  @Get("search")
  searchProducts(
    @Query("searchTerm") searchTerm?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    if (!searchTerm || !searchTerm.trim()) {
      throw new BadRequestException("searchTerm is required");
    }

    return this.productsService.searchProducts(
      searchTerm.trim(),
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  // ✅ PRODUCTS BY CATEGORY
  @Get("category/:category")
  findByCategory(
    @Param("category") category: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.productsService.findByCategory(
      category,
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  // ✅ PRODUCTS BY SELLER
  @Get("seller/:sellerId")
  getProductsBySeller(
    @Param("sellerId", ParseIntPipe) sellerId: number,
  ) {
    return this.productsService.getProductsBySeller(
      sellerId,
      "SELLER",
    );
  }

  // ✅ SINGLE PRODUCT (IMPORTANT)
  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.productsService.findOne(id);
  }

  // ✅ CREATE PRODUCT
  @Post()
  @UseInterceptors(FilesInterceptor("images", 5, multerOptions))
  createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException("At least one image is required");
    }

    return this.productsService.createProductBySeller(
      dto.sellerId,
      "SELLER",
      dto,
      files.map((f) => f.filename),
    );
  }

  // ✅ UPDATE PRODUCT
  @Patch(":id")
  updateProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    if (!dto.sellerId) {
      throw new BadRequestException("sellerId is required");
    }

    return this.productsService.updateProductBySeller(
      id,
      dto.sellerId,
      "SELLER",
      dto,
    );
  }
}
