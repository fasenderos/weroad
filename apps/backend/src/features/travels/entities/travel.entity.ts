import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";
import { Tables } from "../../../common/tables";
import { IMoods } from "../interfaces/moods.interface";

@ObjectType()
export class Moods implements IMoods {
	@Field()
	nature: number;

	@Field()
	relax: number;

	@Field()
	history: number;

	@Field()
	culture: number;

	@Field()
	party: number;
}

@ObjectType()
@Entity({ name: Tables.TRAVELS })
export class Travel extends BaseEntity {
	@Field()
	@Column()
	name: string;

	@Field()
	@Column()
	slug: string;

	@Field()
	@Column({ type: "text" })
	description: string;

	@Field()
	@Column({ type: "timestamptz" })
	startingDate: Date;

	@Field()
	@Column({ type: "timestamptz" })
	endingDate: Date;

	@Field()
	@Column({ unsigned: true })
	price: number;

	@Field(() => Moods)
	@Column({ type: "jsonb" })
	moods: Moods;

	@Field()
	@Column({ default: 5 })
	maxCapacity: number;
}
