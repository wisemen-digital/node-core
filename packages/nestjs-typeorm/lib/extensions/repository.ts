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
    if (this.metadata.primaryColumns.length !== 1) {
      throw new Error(`Entity ${this.metadata.name} has a composite primary key and cannot be fetched in batches`)
    }

    const primaryKey = this.metadata.primaryColumns[0].propertyName

    let lastPrimaryKeyValue: any | undefined = undefined
    let entities: T[] = []
  
    do {
      const where = lastPrimaryKeyValue !== undefined
        ? { ...options.where, [primaryKey]: MoreThan(lastPrimaryKeyValue) }
        : options.where
      const order = options.order !== undefined && primaryKey in options.order
        ? options.order
        : { ...options.order, [primaryKey]: 'ASC' } as FindOptionsOrder<T>
  
      entities = await this.find({
        ...options,
        where,
        order,
        take: batchSize,
      })
  
      if (entities.length === 0) return
  
      yield entities
  
      lastPrimaryKeyValue = entities.at(-1)?.[primaryKey]
    } while (lastPrimaryKeyValue !== undefined)
  }

  findByInBatches (
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    batchSize: number
  ): AsyncGenerator<T[], void, void> {
    return this.findInBatches({ where }, batchSize)
  }
}
