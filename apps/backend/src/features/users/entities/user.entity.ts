import { ObjectType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";
import { Tables } from "../../../common/tables";

@ObjectType()
@Entity({ name: Tables.USERS })
export class User extends BaseEntity {
	@Column({ unique: true })
	email: string;
}
