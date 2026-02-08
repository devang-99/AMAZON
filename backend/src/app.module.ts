/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data_source/data_source';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({...dataSourceOptions}),
    UsersModule,
    ProductsModule,
    CartModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}