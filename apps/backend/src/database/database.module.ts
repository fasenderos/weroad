import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: (config: ConfigService) => {
				const db = config.get("database");
				return {
					type: "postgres",
					host: db.host,
					port: db.port,
					username: db.username,
					password: db.password,
					database: db.database,
					entities: [`${__dirname}./../**/*.entity{.ts,.js}`],
					synchronize: process.env.NODE_ENV !== "production",
				};
			},
			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {}
