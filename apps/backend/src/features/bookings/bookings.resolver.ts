import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { BookingsService } from "./bookings.service";
import { ReserveBookingDto } from "./dtos/reserve-booking.dto";
import { Booking } from "./entities/booking.entity";

@Resolver(() => Booking)
export class BookingsResolver {
	constructor(private readonly service: BookingsService) {}

	@Mutation(() => Booking)
	reserveBooking(@Args("input") dto: ReserveBookingDto): Promise<Booking> {
		return this.service.reserveBooking(dto);
	}
}
