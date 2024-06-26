import { Module } from "@nestjs/common";
import { BookingsModule } from "./bookings/bookings.module";
import { CartsModule } from "./carts/carts.module";
import { TravelsModule } from "./travels/travels.module";
import { UsersModule } from "./users/users.module";

@Module({
	imports: [BookingsModule, CartsModule, TravelsModule, UsersModule],
})
export class FeaturesModule {}
