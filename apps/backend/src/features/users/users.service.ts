import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "../../base/base.service";
import { User } from "./entities/user.entity";

export class UsersService extends BaseService<User> {
	constructor(
		@InjectRepository(User)
		private readonly user: Repository<User>,
	) {
		super(user);
	}
}
