import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType()
export class ReserveBookingDto {
	@Field()
	@IsUUID()
	cartId: string;
}
