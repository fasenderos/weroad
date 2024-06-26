import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import {
	Column,
	CreateDateColumn,
	Generated,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@ObjectType()
export abstract class BaseEntity {
	// ID internally used
	@PrimaryGeneratedColumn()
	id: number;

	// ID exposed to public as "id"
	@Field(() => ID, { name: "id" })
	@Column("uuid", { unique: true })
	@Generated("uuid")
	uuid: string;

	@Field()
	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@Field()
	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt: Date;

	@Exclude()
	@Column({ type: "timestamptz", nullable: true })
	deletedAt: Date | null;
}
