import { DataSource, getMetadataArgsStorage } from 'typeorm'
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm'
import { Provider } from '@nestjs/common'
import { DataSourceOptions } from 'typeorm/browser'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type.js'
import { TypeOrmRepository } from './repository.js'

export function createTypeOrmProviders (
  entities?: EntityClassOrSchema[],
  dataSource?: DataSource | DataSourceOptions | string
): Provider[] {
  return (entities || []).map(entity => ({
    provide: getRepositoryToken(entity, dataSource),
    useFactory: (dataSource: DataSource) => {
      const entityMetadata = dataSource.entityMetadatas.find(meta => meta.target === entity)
      const isTreeEntity = typeof entityMetadata?.treeType !== 'undefined'

      return isTreeEntity
        ? dataSource.getTreeRepository(entity)
        : dataSource.options.type === 'mongodb'
          ? dataSource.getMongoRepository(entity)
          : new TypeOrmRepository(entity, dataSource.manager)
    },
    inject: [getDataSourceToken(dataSource)],
    targetEntitySchema: getMetadataArgsStorage().tables.find(
      item => item.target === entity
    )
  }))
}
