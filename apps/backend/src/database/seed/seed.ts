import { DataSource, type DataSourceOptions } from "typeorm";
import "dotenv/config";
import { addDays } from "date-fns";
import { LoremIpsum } from "lorem-ipsum";
import { getRandomNumberInRange } from "../../common/number";
import { Travel } from "../../features/travels/entities/travel.entity";

const seed = async () => {
	const dataSourceOptions: DataSourceOptions = {
		type: "postgres",
		host: process.env.POSTGRES_HOST ?? "127.0.0.1",
		port: Number.parseInt(process.env.POSTGRES_PORT ?? "5432", 10),
		username: process.env.POSTGRES_USERNAME ?? "postgres",
		password: process.env.POSTGRES_PASSWORD ?? "password",
		database: process.env.POSTGRES_DATABASE ?? "weroad",
		synchronize: true,
		entities: [`${__dirname}./../../**/*.entity{.ts,.js}`],
	};

	const dataSource = new DataSource(dataSourceOptions);
	const database = await dataSource.initialize();

	const lorem = new LoremIpsum({
		sentencesPerParagraph: {
			max: 8,
			min: 4,
		},
		wordsPerSentence: {
			max: 10,
			min: 4,
		},
	});

	const travels: Travel[] = [];
	// Initialize the database with 20 Travels
	for (let index = 0; index < 20; index++) {
		const travel: Travel = {} as Travel;
		const travelName = lorem.generateSentences(1);
		const now = new Date();

		// Start date between 50 and 100 days fron now
		const randomStart = getRandomNumberInRange(50, 100);
		const startingDate = addDays(now, randomStart);
		// End date between 10 and 30 days fron starting day
		const endingDate = addDays(startingDate, getRandomNumberInRange(10, 30));

		travel.name = travelName;
		travel.slug = travelName
			.toLowerCase() // Convert the string to lowercase
			.trim() // Remove whitespace from both ends of the string
			.replace(/[^\w\s-]/g, "") // Remove all special characters except word characters, spaces, and hyphens
			.replace(/[\s_-]+/g, "-") // Replace one or more spaces, underscores, or hyphens with a single hyphen
			.replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
		travel.description = lorem.generateParagraphs(1);
		travel.price = getRandomNumberInRange(100, 1000);
		travel.startingDate = startingDate;
		travel.endingDate = endingDate;
		travel.maxCapacity = 5;
		travel.moods = {
			nature: getRandomNumberInRange(30, 90),
			relax: getRandomNumberInRange(30, 90),
			history: getRandomNumberInRange(30, 90),
			culture: getRandomNumberInRange(30, 90),
			party: getRandomNumberInRange(30, 90),
		};
		travels.push(database.manager.create(Travel, travel));
	}
	await database.manager.save(travels);
};

seed()
	.then(() => console.log("Database initialized successfully"))
	.catch((err) =>
		console.error(
			"something went wrong on database initialization",
			err.message,
		),
	);
