import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartsResolver } from "./carts.resolver";
import { CartsService } from "./carts.service";
import { Cart } from "./entities/cart.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Cart])],
	providers: [CartsService, CartsResolver],
	exports: [CartsService],
})
export class CartsModule {}
