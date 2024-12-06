import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule as TM } from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type.js'
import { DataSource, DataSourceOptions } from 'typeorm'
import { DEFAULT_DATA_SOURCE_NAME } from '@nestjs/typeorm/dist/typeorm.constants.js'
import { EntitiesMetadataStorage } from '@nestjs/typeorm/dist/entities-metadata.storage.js'
import { createTypeOrmProviders } from './create-providers.js'

@Module({})
export class TypeOrmModule extends TM {
  static forFeature (
    entities: EntityClassOrSchema[] = [],
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME
  ): DynamicModule {
    const providers = createTypeOrmProviders(entities, dataSource)

    EntitiesMetadataStorage.addEntitiesByDataSource(dataSource, [...entities])

    return {
      module: TypeOrmModule,
      providers: providers,
      exports: providers
    }
  }
}
