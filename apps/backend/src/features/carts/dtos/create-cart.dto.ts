import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsUUID, Max, Min } from "class-validator";

@InputType()
export class CreateCartDto {
	@Field()
	@IsEmail()
	readonly email: string;

	@Field()
	@Max(5)
	@Min(1)
	readonly seats: number;

	@Field()
	@IsUUID()
	readonly travelId: string;
}
