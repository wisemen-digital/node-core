import { type EntityManager, type EntityTarget, ObjectLiteral, Repository } from 'typeorm'
import { createTransactionManagerProxy } from './transaction.js'

export class TypeOrmRepository<T extends ObjectLiteral> extends Repository <T> {
  constructor (entity: EntityTarget<T>, manager: EntityManager) {
    super(entity, createTransactionManagerProxy(manager))
  }
}
