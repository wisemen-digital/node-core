import { type EntityManager, type EntityTarget, FindOneOptions, FindOptionsOrder, FindOptionsOrderValue, FindOptionsWhere, MoreThan, ObjectLiteral, Repository } from 'typeorm'
import { createTransactionManagerProxy } from './transaction.js'

export class TypeOrmRepository<T extends ObjectLiteral> extends Repository <T> {
  constructor (entity: EntityTarget<T>, manager: EntityManager) {
    super(entity, createTransactionManagerProxy(manager))
  }

  async *findInBatches(
    options: FindOneOptions<T>,
    batchSize: number
  ): AsyncGenerator<T[], void, void> {
    const primaryColumns = this.metadata.primaryColumns;

    if (primaryColumns.length !== 1) {
      throw new Error("findInBatches only supports entities with a single primary column");
    }

    const primaryKey = primaryColumns[0].propertyName

    let lastKey: any | undefined = undefined;
    let entities: T[] = [];
  
    do {
      const where = lastKey
        ? { ...options.where, [primaryKey]: MoreThan(lastKey) }
        : options.where;
      const order = options.order !== undefined && primaryKey in options.order
        ? options.order
        : { ...options.order, [primaryKey]: 'ASC' } as FindOptionsOrder<T>
  
      entities = await this.find({
        ...options,
        where,
        order,
        take: batchSize,
      });
  
      if (entities.length === 0) return;
  
      yield entities;
  
      lastKey = entities.at(-1)?.[primaryKey];
    } while (lastKey !== undefined);
  }

  findByInBatches (
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    batchSize: number
  ): AsyncGenerator<T[], void, void> {
    return this.findInBatches({ where }, batchSize)
  }
}
