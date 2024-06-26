import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CartsService } from "./carts.service";
import { CreateCartDto } from "./dtos/create-cart.dto";
import { ResetCartDto } from "./dtos/reset-cart.dto";
import { Cart } from "./entities/cart.entity";

@Resolver(() => Cart)
export class CartsResolver {
	constructor(private readonly service: CartsService) {}

	@Mutation(() => Cart)
	async initCart(@Args("input") dto: CreateCartDto): Promise<Cart> {
		return this.service.initCart(dto);
	}

	@Mutation(() => Cart)
	async resetCart(@Args("input") dto: ResetCartDto): Promise<Cart> {
		return this.service.resetCart(dto);
	}
}
