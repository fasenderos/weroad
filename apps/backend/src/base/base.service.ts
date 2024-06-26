import {
	DeepPartial,
	DeleteResult,
	FindManyOptions,
	FindOptionsWhere,
	IsNull,
	ObjectLiteral,
	Repository,
	SelectQueryBuilder,
	UpdateResult,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { BaseEntity } from "./base.entity";

export abstract class BaseService<T extends BaseEntity & ObjectLiteral> {
	constructor(readonly repo: Repository<T>) {}

	/**
	 * Instantiating the entity.
	 * @param {DeepPartial<T>} data The entity to be created
	 * @returns The entity
	 */
	createEntity(data: DeepPartial<T>): T {
		// Instantiating the entity before saving so hooks run
		return this.repo.create(data);
	}

	create(data: DeepPartial<T>): Promise<T> {
		const entity = this.createEntity(data);
		return this.save(entity);
	}

	/**
	 * Saves a given entity in the database.
	 * @param {T} data The entity to be created
	 * @returns The created resource
	 */
	save(data: T): Promise<T> {
		return this.repo.save(data);
	}

	/**
	 * Finds entities that match given find options.
	 * @param {FindManyOptions<T>} options The matching conditions for finding
	 * @returns The entities that match the conditions.
	 */
	find(options?: FindManyOptions<T>): Promise<T[]> {
		if (options?.where) {
			if (Array.isArray(options.where)) {
				options.where = options.where.map((x) => this.excludeDeleted(x));
			} else {
				options.where = this.excludeDeleted(options.where);
			}
		}
		return this.repo.find(options);
	}

	/**
	 * Finds first entity that matches given where condition.
	 * If entity was not found in the database - returns null.
	 * @param {FindOptionsWhere<T>} filter The matching conditions for finding
	 * @param {boolean} unselected Get all columns even those with select: false
	 * @returns The entity that match the conditions or null.
	 */
	findOne(filter: FindOptionsWhere<T>, unselected = false): Promise<T | null> {
		if (unselected === true) {
			return this.repo.findOne({
				select: this.getAllTableColumns(),
				where: this.excludeDeleted(filter),
			});
		}
		return this.repo.findOneBy(this.excludeDeleted(filter));
	}

	/**
	 * Find entity by ID. If entity was not found in the database - returns null.
	 * @param {number} id The ID of the entity
	 * @param {boolean} unselected Get all columns even those with select: false
	 * @returns The entity that match the conditions or null.
	 */
	findById(id: number | string, unselected = false): Promise<T | null> {
		const field = typeof id === "number" ? "id" : "uuid";
		return this.findOne(
			{ [field]: id } as unknown as FindOptionsWhere<T>,
			unselected,
		);
	}

	/**
	 * Updates entity by a given conditions.
	 * Does not check if entity exist in the database.
	 * @param {FindOptionsWhere<T>} filter The matching conditions for updating
	 * @param {QueryDeepPartialEntity<T>} data The payload to update the entity
	 */
	update(
		filter: FindOptionsWhere<T>,
		data: QueryDeepPartialEntity<T>,
	): Promise<UpdateResult> {
		return this.repo.update(this.excludeDeleted(filter), data);
	}

	/**
	 * Updates entity partially by ID.
	 * Does not check if entity exist in the database.
	 * @param {number} id The ID of the entity to update
	 * @param {QueryDeepPartialEntity<T>} data The payload to update the entity
	 */
	updateById(
		id: number | string,
		data: QueryDeepPartialEntity<T>,
	): Promise<UpdateResult> {
		const field = typeof id === "number" ? "id" : "uuid";
		const filter = {
			[field]: id,
		} as FindOptionsWhere<T>;
		return this.repo.update(this.excludeDeleted(filter), data);
	}

	/**
	 * By default entities are soft deleted, which means an update of the deletedAt column.
	 * The record still exists in the database but will not be retireved by any find/update query.
	 * When `soft` is false the entity is truly deleted
	 * @param {FindOptionsWhere<T>} filter The matching conditions for updating
	 * @param {boolean} soft When true a soft delete is performed otherwise a real delete.
	 */
	delete(filter: FindOptionsWhere<T>, soft = true): Promise<DeleteResult> {
		if (soft) {
			return this.update(this.excludeDeleted(filter), {
				// @ts-ignore try to fix me
				deletedAt: Date.now(),
			});
		}
		return this.repo.delete(filter);
	}

	/**
	 * By default entities are soft deleted, which means an update of the deletedAt column.
	 * The record still exists in the database, but will not be retireved by any find/update query.
	 * When `soft` is false the entity is truly deleted
	 * @param {number} id The ID of the entity to update
	 * @param {boolean} soft When true a soft delete is performed otherwise a real delete.
	 */
	deleteById(id: number, soft = true): Promise<DeleteResult> {
		if (soft) {
			return this.updateById(id, {
				// @ts-ignore
				deletedAt: new Date(),
			});
		}
		return this.repo.delete(id);
	}

	excludeDeleted(filter: FindOptionsWhere<T>) {
		return {
			...filter,
			deletedAt: IsNull(),
		};
	}

	private getAllTableColumns(): (keyof T)[] {
		return this.repo.metadata.columns.map(
			(col) => col.propertyName,
		) as (keyof T)[];
	}
}
