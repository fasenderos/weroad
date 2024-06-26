import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";
import { Tables } from "../../../common/tables";

@ObjectType()
@Entity({ name: Tables.BOOKINGS })
export class Booking extends BaseEntity {
	@Column()
	userId: number;

	@Field({ name: "userId" })
	@Column()
	userUuid: string;

	@Column()
	travelId: number;

	@Field({ name: "travelId" })
	@Column()
	travelUuid: string;

	@Field()
	@Column({ unsigned: true })
	seatsReserved: number;
}
