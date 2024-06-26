import { name, version } from "../../package.json";
export default () => {
	return {
		app: {
			name,
			version,
			cartExpirationMs: 15 * 60 * 1000, // 15 minutes
		},
		database: {
			host: process.env.POSTGRES_HOST ?? "127.0.0.1",
			port: Number.parseInt(process.env.POSTGRES_PORT ?? "5432", 10),
			username: process.env.POSTGRES_USERNAME ?? "postgres",
			password: process.env.POSTGRES_PASSWORD ?? "password",
			database: process.env.POSTGRES_DATABASE ?? "weroad",
		},
		server: {
			port: Number.parseInt(process.env.SERVER_PORT ?? "3001", 10),
			address: process.env.SERVER_ADDRESS ?? "127.0.0.1",
		},
	};
};
