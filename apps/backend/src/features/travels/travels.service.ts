import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../../base/base.service";
import { BookingsService } from "../bookings/bookings.service";
import { CartsService } from "../carts/carts.service";
import { Travel } from "./entities/travel.entity";

@Injectable()
export class TravelsService extends BaseService<Travel> {
	constructor(
		@InjectRepository(Travel)
		private readonly travel: Repository<Travel>,
		private readonly cartsService: CartsService,
		private readonly bookingsService: BookingsService,
	) {
		super(travel);
	}

	async getTravelAvailability(travelId: string): Promise<number> {
		const travel = await this.findById(travelId);
		if (!travel) throw new NotFoundException();
		const carts = await this.cartsService.getCartsByTravelId(travel.id);
		const reservedSeats = await this.bookingsService.getReservedSeatsForTravel(
			travel.id,
		);
		let availability = travel.maxCapacity - reservedSeats;
		if (carts.length) {
			availability = carts.reduce(
				(acc, curr) => acc - curr.lockedSeats,
				availability,
			);
		}
		return availability;
	}
}
