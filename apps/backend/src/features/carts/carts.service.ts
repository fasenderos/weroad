import {
	BadRequestException,
	HttpException,
	NotFoundException,
	UnprocessableEntityException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { PinoLogger } from "nestjs-pino";
import { DataSource, IsNull, MoreThan, Repository } from "typeorm";
import { BaseService } from "../../base/base.service";
import { Booking } from "../bookings/entities/booking.entity";
import { Travel } from "../travels/entities/travel.entity";
import { CreateCartDto } from "./dtos/create-cart.dto";
import { ResetCartDto } from "./dtos/reset-cart.dto";
import { Cart } from "./entities/cart.entity";

export class CartsService extends BaseService<Cart> {
	cartExpirationMs: number;
	constructor(
		@InjectRepository(Cart)
		private readonly cart: Repository<Cart>,
		private readonly configService: ConfigService,
		private readonly dataSource: DataSource,
		readonly logger: PinoLogger,
	) {
		super(cart);
		const { cartExpirationMs } = configService.get("app");
		this.cartExpirationMs = cartExpirationMs;
		this.logger.setContext(CartsService.name);
	}

	async initCart(dto: CreateCartDto): Promise<Cart> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// Check if the travel exists
			const travel = await queryRunner.manager.findOne(Travel, {
				where: this.excludeDeleted({ uuid: dto.travelId }),
				lock: { mode: "pessimistic_write" },
			});
			if (!travel)
				throw new UnprocessableEntityException(
					"The selected travel is not available",
				);

			// Get already reserved seats for this travel
			const bookings = await queryRunner.manager.find(Booking, {
				where: { travelId: travel.id, deletedAt: IsNull() },
				lock: { mode: "pessimistic_write" },
			});
			const reservedSeats = bookings.reduce(
				(acc, curr) => acc + curr.seatsReserved,
				0,
			);
			if (reservedSeats >= travel.maxCapacity)
				throw new UnprocessableEntityException("The selected travel is full");

			// Check if carts for the same travel already exists
			const carts = await queryRunner.manager.find(Cart, {
				where: this.excludeDeleted({
					travelId: travel.id,
					expiresAt: MoreThan(new Date()),
				}),
				lock: { mode: "pessimistic_write" },
			});

			let userCart: Cart;
			let lockedSeats = dto.seats;
			let updateCart = false;
			if (carts.length > 0) {
				for (const cart of carts) {
					lockedSeats += cart.lockedSeats;
					// Se l'utente aveva già un carrello aperto e il numero di seats che sta chiedendo è
					// diverso da quello precedente, dobbiamo scorporare la vecchia prenotazione,
					// e aggiornare di il cart se diversa dalla precedente
					if (cart.email === dto.email) {
						lockedSeats -= cart.lockedSeats;
						if (cart.lockedSeats !== dto.seats) updateCart = true;
						userCart = cart;
					}
				}
			}

			if (lockedSeats + reservedSeats > travel.maxCapacity) {
				const availableSeats =
					travel.maxCapacity - reservedSeats - lockedSeats + dto.seats;
				throw new UnprocessableEntityException(
					availableSeats > 0
						? `At the moment we have only ${availableSeats} ${
								availableSeats > 1 ? "seats" : "seat"
							} available for this travel.`
						: "At the moment we have no availability for this travel, please try again later.",
				);
			}

			// Check if we need to update the user cart seat
			if (updateCart) {
				const response = await queryRunner.manager.update(Cart, userCart.id, {
					lockedSeats: dto.seats,
				});

				if (response.affected !== 1)
					throw new UnprocessableEntityException("Something went wrong");
				userCart.lockedSeats = dto.seats;
			}

			if (!userCart) {
				const newCart = this.createEntity({
					email: dto.email,
					travelId: travel.id,
					travelUuid: travel.uuid,
					lockedSeats: dto.seats,
					expiresAt: new Date(Date.now() + this.cartExpirationMs),
				});
				userCart = await queryRunner.manager.save(newCart);
			}

			// Commit the transaction and if everything is successful return the user cart
			await queryRunner.commitTransaction();

			return userCart;
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

	async resetCart(dto: ResetCartDto): Promise<Cart> {
		// check if the cart exist
		const exist = await this.getValidCartById(dto.id);
		if (!exist) throw new NotFoundException("Cart not found");

		// Update the expiration and return the cart with the new expiration time
		const newExpiration = new Date(Date.now() + this.cartExpirationMs);
		await this.updateById(exist.id, { expiresAt: newExpiration });
		exist.expiresAt = newExpiration;
		return exist;
	}

	getValidCartById(id: number | string): Promise<Cart | null> {
		const field = typeof id === "string" ? "uuid" : "id";
		return this.findOne({ [field]: id, expiresAt: MoreThan(new Date()) });
	}

	getCartsByTravelId(travelId: number | string): Promise<Cart[]> {
		const field = typeof travelId === "string" ? "travelUuid" : "travelId";
		return this.find({
			where: { [field]: travelId, expiresAt: MoreThan(new Date()) },
		});
	}
}
