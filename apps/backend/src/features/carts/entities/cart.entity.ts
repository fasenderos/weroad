import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";
import { Tables } from "../../../common/tables";

@ObjectType()
@Entity({ name: Tables.CARTS })
export class Cart extends BaseEntity {
	@Field()
	@Column()
	email: string;

	// We don't want to expose the internal travel id
	@Column()
	travelId: number;

	@Field({ name: "travelId" }) // Externally is travelId
	@Column()
	travelUuid: string;

	@Field()
	@Column({ unsigned: true })
	lockedSeats: number;

	@Field()
	@Column({ type: "timestamptz" })
	expiresAt: Date;
}
