import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	hello(): "Hello World" {
		return "Hello World";
	}
	@Get("ping")
	ping(): "pong" {
		return this.appService.ping();
	}
}
