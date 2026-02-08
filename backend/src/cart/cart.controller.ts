/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':userId')
  addToCart(
    @Param('userId') userId: number,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(Number(userId), dto);
  }

  @Get(':userId')
  getMyCart(@Param('userId') userId: number) {
    return this.cartService.getMyCart(Number(userId));
  }

  @Delete(':userId/:productId')
  removeItem(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ) {
    return this.cartService.removeItem(
      Number(userId),
      Number(productId),
    );
  }

  @Delete(':userId')
  clearCart(@Param('userId') userId: number) {
    return this.cartService.clearCart(Number(userId));
  }
}
