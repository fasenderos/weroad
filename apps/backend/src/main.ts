import fastifyHelmet from "@fastify/helmet";
// import fastifyHelmet from "@fastify/helmet";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

async function bootstrap() {
	// Use NestJs with Fastify Http framework
	const fastify = new FastifyAdapter({ logger: false });
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		fastify,
	);

	// Get app configuration
	const configService = app.get(ConfigService);
	const { name, version } = configService.get("app");
	const { port, address } = configService.get("server");

	// Enable Fastify Helmet
	const helmetOptions = {
		// This is added for make the Graphql Playground happy
		contentSecurityPolicy: {
			directives: {
				"script-src": [`'self'`, `https: 'unsafe-inline'`, "cdn.jsdelivr.net"],
			},
		},
	};
	await app.register(fastifyHelmet, helmetOptions);

	app.enableCors({
		origin: ["http://localhost:3000"],
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true,
	});

	const pinoLogger = app.get(Logger);
	app.useLogger(pinoLogger);

	await app.listen(port, address);

	pinoLogger.log(`${name}@v${version} is running on: ${await app.getUrl()}`);
}
bootstrap();
