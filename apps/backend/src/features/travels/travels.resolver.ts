import { NotFoundException } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { Travel } from "./entities/travel.entity";
import { TravelsService } from "./travels.service";

@Resolver(() => Travel)
export class TravelsResolver {
	constructor(private readonly service: TravelsService) {}

	@Query(() => [Travel], { name: "travels" })
	async getTravels(): Promise<Travel[]> {
		return this.service.find();
	}

	@Query(() => Travel, { name: "travel" })
	async getTravelById(
		@Args("id", { type: () => String }) id: string,
	): Promise<Travel> {
		const travel = await this.service.findById(id);
		if (!travel) throw new NotFoundException();
		return travel;
	}

	@Query(() => Number, { name: "availability" })
	async getTravelAvailability(
		@Args("id", { type: () => String }) id: string,
	): Promise<number> {
		return this.service.getTravelAvailability(id);
	}
}
