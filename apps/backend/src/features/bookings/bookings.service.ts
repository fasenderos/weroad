import {
	BadRequestException,
	HttpException,
	UnprocessableEntityException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { PinoLogger } from "nestjs-pino";
import { DataSource, MoreThan, Repository } from "typeorm";
import { BaseService } from "../../base/base.service";
import { CartsService } from "../carts/carts.service";
import { Cart } from "../carts/entities/cart.entity";
import { Travel } from "../travels/entities/travel.entity";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { ReserveBookingDto } from "./dtos/reserve-booking.dto";
import { Booking } from "./entities/booking.entity";

export class BookingsService extends BaseService<Booking> {
	constructor(
		@InjectRepository(Booking)
		private readonly booking: Repository<Booking>,
		private readonly cartsService: CartsService,
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
		private readonly dataSource: DataSource,
		readonly logger: PinoLogger,
	) {
		super(booking);
		this.logger.setContext(BookingsService.name);
	}

	async getReservedSeatsForTravel(travelId: string | number): Promise<number> {
		const field = typeof travelId === "number" ? "travelId" : "travelUuid";
		const bookings = await this.find({ where: { [field]: travelId } });
		return bookings.reduce((acc, curr) => acc + curr.seatsReserved, 0);
	}

	async reserveBooking(dto: ReserveBookingDto): Promise<Booking> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// Get the cart by looking for not expired ones
			const cart = await queryRunner.manager.findOne(Cart, {
				where: this.cartsService.excludeDeleted({
					uuid: dto.cartId,
					expiresAt: MoreThan(new Date()),
				}),
				lock: { mode: "pessimistic_write" },
			});
			if (!cart)
				throw new UnprocessableEntityException(
					"Your cart does not exist or has expired",
				);

			// check if user already exist
			let user = await queryRunner.manager.findOne(User, {
				where: this.usersService.excludeDeleted({ email: cart.email }),
			});
			if (!user) {
				const userEntity = queryRunner.manager.create(User, {
					email: cart.email,
				});
				user = await queryRunner.manager.save(User, userEntity);
			}

			// Even if a cart exist, check if the travel is valid and not already full
			const travel = await queryRunner.manager.findOne(Travel, {
				where: this.excludeDeleted({ id: cart.travelId }),
				lock: { mode: "pessimistic_write" },
			});
			if (!travel)
				throw new UnprocessableEntityException(
					"The selected travel is not available",
				);

			// Get already reserved bookings
			const reservedSeats = await this.getReservedSeatsForTravel(travel.id);
			if (reservedSeats + cart.lockedSeats > travel.maxCapacity)
				throw new UnprocessableEntityException("The selected travel is full");

			// Remove the cart
			await queryRunner.manager.delete(Cart, { id: cart.id });

			// Create the booking
			const bookingInstance = queryRunner.manager.create(Booking, {
				userId: user.id,
				userUuid: user.uuid,
				travelId: travel.id,
				travelUuid: travel.uuid,
				seatsReserved: cart.lockedSeats,
			});
			const booking = await queryRunner.manager.save(bookingInstance);

			// Commit the transaction and if everything is successful return the booking
			await queryRunner.commitTransaction();

			return booking;
		} catch (err) {
			// since we have errors lets rollback the changes we made
			await queryRunner.rollbackTransaction();
			// Re-throw the error
			if (err instanceof HttpException) throw err;
			// Error not throwed by us, we can do nothing, log and throw a general bad exception
			this.logger.error(err, `dto: ${JSON.stringify(dto)}`);
			throw new BadRequestException();
		} finally {
			// you need to release a queryRunner which was manually instantiated
			await queryRunner.release();
		}
	}
}
