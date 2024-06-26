import { IncomingMessage, ServerResponse } from "node:http";
import { join } from "node:path";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { LoggerModule } from "nestjs-pino";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import configuration from "./config/configuration";
import { DatabaseModule } from "./database/database.module";
import { FeaturesModule } from "./features/features.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			cache: true,
		}),
		DatabaseModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), "src/schema.gql"),
			playground: true,
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				// We want to use pino-pretty only if there is a human watching this,
				// otherwise we log as newline-delimited JSON.
				...(process.stdout.isTTY
					? {
							transport: { target: "pino-pretty" },
							level: "debug",
						}
					: {
							level: "info",
						}),
				// Define a custom logger level
				customLogLevel: (_: IncomingMessage, res: ServerResponse) => {
					if (res.statusCode == null || res.statusCode < 300) {
						// Disable logs for response without error
						return "silent";
					}
					if (res.statusCode >= 300 && res.statusCode < 500) {
						return "warn";
					}
					return "error";
				},
			},
		}),
		FeaturesModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
