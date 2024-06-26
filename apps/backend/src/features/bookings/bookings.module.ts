import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartsModule } from "../carts/carts.module";
import { UsersModule } from "../users/users.module";
import { BookingsResolver } from "./bookings.resolver";
import { BookingsService } from "./bookings.service";
import { Booking } from "./entities/booking.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Booking]), CartsModule, UsersModule],
	providers: [BookingsService, BookingsResolver],
	exports: [BookingsService],
})
export class BookingsModule {}
