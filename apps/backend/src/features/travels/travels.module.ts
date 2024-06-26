import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookingsModule } from "../bookings/bookings.module";
import { CartsModule } from "../carts/carts.module";
import { Travel } from "./entities/travel.entity";
import { TravelsResolver } from "./travels.resolver";
import { TravelsService } from "./travels.service";

@Module({
	imports: [TypeOrmModule.forFeature([Travel]), CartsModule, BookingsModule],
	providers: [TravelsService, TravelsResolver],
})
export class TravelsModule {}
