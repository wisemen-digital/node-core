import { DataSource } from 'typeorm'

export async function migrate (source: DataSource): Promise<void> {
  while (true) {
    try {
      const hasMigrations = await source.showMigrations()

      if (!hasMigrations) return

      await source.query(
        'CREATE TABLE "_lock" ("id" SERIAL NOT NULL, PRIMARY KEY ("id"));'
      )

      break
    } catch (_e) {
      // eslint-disable-next-line no-console
      console.log(
        'Database lock table (_lock) already exists. Waiting for release...'
      )
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  await source.runMigrations({ transaction: 'all' })
  await source.query('DROP TABLE "_lock"')
}
