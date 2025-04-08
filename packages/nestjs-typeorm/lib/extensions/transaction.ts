import { AsyncLocalStorage } from 'async_hooks'
import type { DataSource, EntityManager } from 'typeorm'

const transactionStorage = new AsyncLocalStorage<EntityManager | null>()

export async function transaction<T> (
  dataSource: DataSource,
  runInTransaction: (entityManager: EntityManager) => Promise<T>
): Promise<T> {
  const transactionManager = transactionStorage.getStore()

  if (transactionManager != null) {
    return await transactionManager.transaction(runInTransaction)
  }

  return await dataSource.transaction(async (manager) => {
    return await transactionStorage.run(manager, async () => {
      return await runInTransaction(manager)
    })
  })
}

export function createTransactionManagerProxy (manager: EntityManager): EntityManager {
  return new Proxy(manager, {
    get (target, prop) {
      const manager = transactionStorage.getStore()

      if (manager != null) {
        return manager[prop] as unknown
      } else {
        return target[prop] as unknown
      }
    }
  })
}
